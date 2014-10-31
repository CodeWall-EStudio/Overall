var EventProxy = require('eventproxy');
var _ = require('underscore');

var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var fileHelper = require('../modules/file_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


/**
 * 列出被评价者
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.appraisees = function(req, res) {
    var parameter = req.parameter;
    var evaluationType = parameter.evaluationType;

    var loginUser = req.loginUser;
    var term = parameter.term;

    var param;
    var ep = new EventProxy();

    ep.fail(function(err) {
        res.json({
            err: ERR.SERVER_ERROR,
            msg: '拉取被评价者列表出错了',
            detail: err
        });
    });

    // TODO 这里还要判断权限 role
    if (evaluationType === 1) { // 学生评价老师
        // 先拉学生所在的班级
        db.Students.findOne({
            id: loginUser.id
        }, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            // 通过班级找到对应的老师们
            param = {
                classes: {
                    $elemMatch: {
                        grade: doc.grade,
                        'class': doc['class']
                    }
                }
            };
            Logger.debug('[evaluation.appraisees#Teachers.find] evaluationType: ', evaluationType, 'query: ', param);
            db.Teachers.find(param, {
                id: 1,
                name: 1
            }, function(err, docs) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }
                ep.emitLater('success', docs);
            });
        });

    } else { // 互评
        param = {
            term: term,
            id: loginUser.id
        };

        db.RelationShips.findOne(param, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            if (!doc) {
                return res.json({
                    err: ERR.NOT_FOUND,
                    msg: '没有找到对应互评关系'
                });
            }
            var results = [];
            doc.teachers.forEach(function(teacher) {
                if (teacher.value) {
                    results.push(teacher);
                }
            });
            ep.emitLater('success', results);
        });
    }

    ep.on('success', function(teachers) {
        // 获取分组信息
        db.TeacherGroups.find({}, function(err, teacherGroups) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            // 查找教师所在分组
            var results = [];
            teachers.forEach(function(teacher) {
                teacher = teacher.toObject();
                if (!('value' in teacher) && loginUser.role === 1) {
                    teacher.value = 1; // 学生的问卷类型固定是 1
                }
                results.push(teacher);

                // 三层循环...
                for (var i = 0; i < teacherGroups.length; i++) {
                    var group = teacherGroups[i];
                    for (var j = 0; j < group.teachers.length; j++) {
                        var t = group.teachers[j];
                        if (teacher.id === t.id) {
                            teacher.teacherGroup = {
                                _id: group._id,
                                id: group.id,
                                name: group.name
                            };
                            return;
                        }
                    }
                }
            }); // end teachers.forEach

            ep.emitLater('fetchTeacherGroups', results);
        });

    }); // end ep.success

    ep.on('fetchTeacherGroups', function(teachers) {

        ep.after('totalScore', teachers.length, function() {
            res.json({
                err: ERR.SUCCESS,
                result: teachers
            });
        });

        teachers.forEach(function(teacher) {

            db.EOIndicateScores.findOne({
                term: term,
                type: evaluationType,
                appraiseeId: teacher.id,
                appraiserId: loginUser.id,
            }, ep.group('totalScore', function(doc) {

                teacher.totalScore = doc ? doc.totalScore : 0;
            }));
        });

    }); // end ep.fetchTeacherGroups

};


/**
 * 对指定人进行评价
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.appraise = function(req, res) {
    var loginUser = req.loginUser;
    var parameter = req.parameter;

    var term = parameter.term;
    var evaluationType = parameter.evaluationType;
    var appraiseeId = parameter.appraiseeId;
    var scores = parameter.scores;
    var questionnaire = parameter.questionnaire;

    var totalScore = 0;
    var scoresMap = {};
    scores.forEach(function(s) {
        totalScore += s.score;
        scoresMap[s.question] = {
            question: s.question,
            score: s.score
        };
    });

    var appraiserId = loginUser.id;
    // TODO 验证 appraiserId 和 appraiseeId 是否有对应的评估关系

    // 先找一下有没有已经评过分
    db.EOIndicateScores.findOne({
        term: term,
        type: evaluationType,
        appraiseeId: appraiseeId,
        appraiserId: appraiserId
    }, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        if (doc) { // 已经有的, 就覆盖
            doc.scores = scoresMap;
            doc.totalScore = totalScore;
            doc.questionnaire = questionnaire;
            doc.save(function(err, doc) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }
                res.json({
                    err: ERR.SUCCESS,
                    result: doc
                });
            });
        } else {
            db.EOIndicateScores.create({
                term: term,
                type: evaluationType,
                appraiseeId: appraiseeId,
                appraiserId: appraiserId,
                scores: scoresMap,
                totalScore: totalScore,
                questionnaire: questionnaire
            }, function(err, doc) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }
                res.json({
                    err: ERR.SUCCESS,
                    result: doc
                });
            });
        }
    });
};

/**
 * 查看打分结果
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.detail = function(req, res) {

    var parameter = req.parameter;
    var loginUser = req.loginUser;

    var term = parameter.term;

    //  评估类型, 0: 教师互评, 1: 生评
    var evaluationType = parameter.evaluationType;
    var appraiseeId = parameter.appraiseeId;

    var appraiserId = loginUser.id;

    // 1. 获取互评关系
    // 2. 获取问卷
    // 3. 获取打分细节

    var param = {
        term: term,
        id: appraiseeId // 以被评论教师的维度去找, 避免学生没办法找 RelationShips 的问题
    };

    // 1.
    db.RelationShips.findOne(param, function(err, ship) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        if (!ship) {
            return res.json({
                err: ERR.NOT_FOUND,
                msg: '还没有给该教师配置互评关系'
            });
        }

        // 2.
        param = {
            term: term
        };
        if (evaluationType === 1) {
            param.order = ship.student;
        } else {
            var item = _.find(ship.teachers, function(item) {
                return item.id === appraiserId;
            });
            if (!item) {
                return res.json({
                    err: ERR.NOT_FOUND,
                    msg: '你与该教师没有互评关系!'
                });
            }
            param.order = item.value;
        }
        db.Questionnaires.findOne(param, function(err, quest) {
            if (err) {
                return dbHelper.handleError(err, res);
            }

            var result = {
                appraiserId: appraiserId,
                appraiseeId: appraiseeId,
                questionnaire: quest
            };

            param = {
                term: term,
                type: evaluationType,
                appraiseeId: appraiseeId,
                appraiserId: appraiserId,
            };

            Logger.debug('[evaluation.detail#EOIndicateScores.findOne] query: ', param);
            db.EOIndicateScores.findOne(param, function(err, doc) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }

                result.detail = doc;

                return res.json({
                    err: ERR.SUCCESS,
                    result: result
                });

            });
        }); // end Questionnaires.findOne

    }); // end RelationShips.findOne

};