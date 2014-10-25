var EventProxy = require('eventproxy');

var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
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
                'classes.grade': doc.grade,
                'classes.class': doc['class']
            };
            Logger.debug('[evaluation.appraisees] evaluationType: ', evaluationType, 'query: ', param);
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
    scores.forEach(function(s) {
        totalScore += s.score;
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
            doc.scores = scores;
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
                scores: scores,
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

exports.detail = function(req, res) {

    var parameter = req.parameter;
    var loginUser = req.loginUser;

    var term = parameter.term;
    var evaluationType = parameter.evaluationType;
    var appraiseeId = parameter.appraiseeId;

    var appraiserId = loginUser.id;

    var param = {
        term: term,
        type: evaluationType,
        appraiseeId: appraiseeId,
        appraiserId: appraiserId,
    };
    Logger.debug('[evaluation.detail] param: ', param);
    db.EOIndicateScores.findOne(param, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        if (!doc) {
            return res.json({
                err: ERR.NOT_FOUND,
                msg: '没有找到评价记录'
            });
        }

        db.Questionnaires.findById(doc.questionnaire, function(err, quest) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            doc = doc.toObject();
            doc.questionnaire = quest;
            res.json({
                err: ERR.SUCCESS,
                result: doc
            });
        });


    });


};