var EventProxy = require('eventproxy');
var _ = require('underscore');

var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var fileHelper = require('../modules/file_helper');

var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.import = function(req, res) {

    var parameter = req.parameter;
    var group = parameter.indicatorGroup;
    var data = fileHelper.readExcel(req, res);
    if (data === null) {
        return;
    }

    var docs = [];
    data.forEach(function(item) {
        var doc = {
            teacherId: item['教师用户名'],
            teacherName: item['教师姓名'],
            term: group.term,
            indicatorGroup: group,
            scores: {},
            totalScore: item['总分'] || 0
        };

        group.indicators.forEach(function(indicator) {
            doc.scores[indicator._id] = {
                indicator: indicator,
                score: Number(item[indicator.name] || 0)
            };
        });

        docs.push(doc);
    });

    db.IndicatorScores.remove({
        indicatorGroup: group
    }, function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        db.IndicatorScores.create(docs, function(err) {

            if (err) {
                return dbHelper.handleError(err, res);
            }
            // Logger.debug(arguments);
            res.json({
                err: ERR.SUCCESS,
                msg: '成功导入' + (arguments.length - 1) + '条数据'
            });
        });
    });

};


function createSummary(teacher, indGroups, callback) {

    var ep = new EventProxy();
    ep.fail(callback);

    // 把计算出来的结果都放在 result 里方便使用
    var result = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        totalScore: 0,
        scores: {}
    };

    ep.after('indGroups.forEach', indGroups.length, function() {

        for (var i in result.scores) {
            result.totalScore += result.scores[i];
        }

        callback(null, result);

    });

    indGroups.forEach(function(indGroup) {


        db.IndicatorScores.findOne({
            term: indGroup.term,
            teacherId: teacher.id,
            indicatorGroup: indGroup
        }, function(err, indScore) {
            if (err) {
                return callback(err);
            }

            ep.after('EOIndicateAverageScores.findOne', indGroup.indicators.length, function(list) {
                Logger.debug('[createSummary#EOIndicateAverageScores.findOne] result: ', list);
                var totalScore = 0;
                list.forEach(function(item) {
                    totalScore += item && item.averageScore || 0;
                });

                result.scores[indGroup._id] = totalScore;
                ep.group('indGroups.forEach')();

            });

            indGroup.indicators.forEach(function(ind) {
                // gatherType 1: 文件导入, 2: 互评平均分, 3: 生评平均分
                if (ind.gatherType === 2 || ind.gatherType === 3) {

                    db.EOIndicateAverageScores.findOne({
                        term: indGroup.term,
                        type: ind.gatherType === 2 ? 0 : 1,
                        appraiseeId: teacher.id
                    }, ep.group('EOIndicateAverageScores.findOne'));
                } else {
                    var score = indScore ? indScore.scores[ind._id] : {};
                    ep.group('EOIndicateAverageScores.findOne')(null, {
                        averageScore: Number(score && score.score || 0)
                    });
                }
            });

        }); // end IndicatorScores.findOne

    }); // end indGroups.forEach

}

/**
 * 创建评价概览, 与 createIndicatorDetail 相比, 少了各个指标的平均分
 */
function createIndicatorSummary(parameter, callback) {

    var term = parameter.term;
    var teacherGroup = parameter.teacherGroup;
    var teacherName = parameter.teacherName;

    var ep = new EventProxy();
    ep.fail(callback);

    // 1. 获取需要生成报告的老师(们)
    // 1.1 获取指标组们
    // 2. 针对每个老师生成单独的报告
    // 3. 有生评互评的, 要另外走逻辑计算

    // 1.
    // teacherName 和 teacherGroup 是互斥的
    if (teacherGroup) {
        ep.emitLater('Users.find', teacherGroup.teachers);
    } else if (teacherName) {
        db.Users.find({
            name: teacherName
        }, ep.doneLater('Users.find'));
    }

    // 1.1
    db.IndicatorGroups.find({
        term: term
    }, ep.doneLater('IndicatorGroups.find'));


    ep.all('Users.find', 'IndicatorGroups.find', function(teachers, indGroups) {

        ep.after('createSummary', teachers.length, function(list) {

            callback(null, {
                indicatorGroups: indGroups,
                results: list
            });
        });

        // 2.
        teachers.forEach(function(teacher) {
            createSummary(teacher, indGroups, ep.group('createSummary'));
        });

    });

}

/**
 * 获取评价列表
 *
 */
function fetchIndicatorScores(parameter, callback) {
    var term = parameter.term;
    var teacherGroup = parameter.teacherGroup;
    var teacherName = parameter.teacherName;
    var indicatorGroup = parameter.indicatorGroup;

    var param = {
        term: term
    };

    param.indicatorGroup = indicatorGroup;

    // teacherName 和 teacherGroup 是互斥的
    if (teacherGroup) {
        var teacherIds = [];
        teacherGroup.teachers.forEach(function(teacher) {
            teacherIds.push(teacher.id);
        });
        param.teacherId = {
            $in: teacherIds
        };
    } else if (teacherName) {
        param.teacherName = teacherName;
    }

    Logger.debug('[IndicatorScore.report#fetchIndicatorScores] query: ', param);
    db.IndicatorScores.find(param, null, {
        sort: {
            teacherId: 1
        }
    }, function(err, indScores) {
        if (err) {
            return callback(err);
        }

        // 报表详情, 根据条件搜索 IndicatorScores 就可以了
        // TODO 如果是行政指标组, 这里是否也要计算互评和生评 ?
        callback(null, indScores);

    });
}


/**
 * 评分概要和详情
 */
exports.summary = function(req, res) {

    var parameter = req.parameter;

    var startTime = Date.now();

    function callback(err, result) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        res.json({
            err: ERR.SUCCESS,
            result: result
        });
        Logger.info('[IndicatorScore.summary] end, indicatorGroup: ',
            parameter.indicatorGroup, ', cost: ', Date.now() - startTime, 'ms');

    }
    createIndicatorSummary(parameter, callback);


};

exports.summarylist = function(req, res) {
    var parameter = req.parameter;

    var startTime = Date.now();

    function callback(err, result) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        res.json({
            err: ERR.SUCCESS,
            result: result
        });
        Logger.info('[IndicatorScore.summaryList] end, indicatorGroup: ',
            parameter.indicatorGroup, ', cost: ', Date.now() - startTime, 'ms');

    }

    // 传了[指标组]就查询指定指标组, 否则就是吐概要
    fetchIndicatorScores(parameter, callback);
};

function createReport(teacher, indGroups, callback) {
    var ep = new EventProxy();
    ep.fail(callback);

    // 把计算出来的结果都放在 result 里方便使用
    var result = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        totalScore: 0,
        scores: {}
    };

    ep.after('indGroups.forEach', indGroups.length, function() {

        for (var i in result.scores) {
            result.totalScore += result.scores[i].totalScore;
        }

        callback(null, result);

    });

    indGroups.forEach(function(indGroup) {


        db.IndicatorScores.findOne({
            term: indGroup.term,
            teacherId: teacher.id,
            indicatorGroup: indGroup
        }, function(err, indScore) {
            if (err) {
                return callback(err);
            }

            ep.after('EOIndicateAverageScores.findOne', indGroup.indicators.length, function(list) {
                Logger.debug('[createSummary#EOIndicateAverageScores.findOne] result: ', list);
                var totalScore = 0;
                list.forEach(function(item) {
                    totalScore += item && item.score || 0;
                });

                result.scores[indGroup._id] = {
                    totalScore: totalScore,
                    list: list
                };
                ep.group('indGroups.forEach')();

            });

            indGroup.indicators.forEach(function(ind) {
                // gatherType 1: 文件导入, 2: 互评平均分, 3: 生评平均分
                var score = indScore ? indScore.scores[ind._id] : {
                    score: 0,
                    indicator: ind
                };
                if (ind.gatherType === 2 || ind.gatherType === 3) {

                    db.EOIndicateAverageScores.findOne({
                        term: indGroup.term,
                        type: ind.gatherType === 2 ? 0 : 1,
                        appraiseeId: teacher.id
                    }, ep.group('EOIndicateAverageScores.findOne', function(doc) {
                        score.score = doc && doc.averageScore || 0;
                        return score;
                    }));
                } else {
                    ep.group('EOIndicateAverageScores.findOne')(null, score);
                }
            });

        }); // end IndicatorScores.findOne

    }); // end indGroups.forEach

}

/**
 * 创建评价报告
 * 1. 同一教师分组的人的总分都要计算, 因为要计算同组平均分和排名
 * 2. 每一个指标也要算同组平均分
 */
function createIndicatorReport(parameter, callback) {
    var term = parameter.term;
    var teacherId = parameter.teacherId;

    var ep = new EventProxy();
    ep.fail(callback);

    // 1. 获取需要生成报告的老师所在的分组
    // 1. 获取当前学期的指标组们
    // 2. 针对每个老师生成单独的报告
    // 3. 有生评互评的, 要另外走逻辑计算
    // 4. 列表中找到目标老师
    // 5. 计算同组平均分和排名

    db.Users.find({
        id: teacherId
    }, function(err, teacher) {
        if (err) {
            return callback(err);
        }
        if (!teacher) {
            return callback('没找到这个人');
        }

        // 1. 获取需要生成报告的老师所在的分组
        db.TeacherGroups.findOne({
            term: term,
            'teachers.id': teacherId
        }, ep.done('TeacherGroups.findOne'));
    });

    // 1. 获取当前学期的指标组们
    db.IndicatorGroups.find({
        term: term
    }, ep.done('IndicatorGroups.find'));

    ep.all('TeacherGroups.findOne', 'IndicatorGroups.find', function(teacherGroup, indGroups) {
        if (!teacherGroup) {
            return callback('该教师没有配置教师组');
        }
        ep.after('teacherGroup.teachers.forEach', teacherGroup.teachers.length, function(list) {

            // 4. 列表中找到目标老师和计算平均分

            var teacherGroupObj = teacherGroup.toObject();
            delete teacherGroupObj.teachers;

            var result = {
                teacherId: teacherId,
                teacherGroup: teacherGroupObj, // 教师所在分组
                indicatorGroups: indGroups, // 当前学期的所有指标组
                results: {}, // 
                totalScore: 0, // 当前所有指标组的总得分
                totalTeacher: teacherGroup.teachers.length, // 同组教师人数
                averageScore: 0, // 同组平均分
                ranking: 0 // 同组排名
            };
            result.__for__test = list;

            var totalScore = 0;

            /*list[{
                teacherId: teacher.id,
                teacherName: teacher.name,
                totalScore: 0,
                scores: {}
            }]*/

            list.sort(function(a, b) {
                return a.totalScore - b.totalScore;
            });

            var groupTotalScore = 0;

            list.forEach(function(item, i) {
                if (item.teacherId === teacherId) {
                    result.ranking = i;
                    result.totalScore = item.totalScore;
                    result.results = item.scores;
                }
                groupTotalScore += item.totalScore;

            });

            result.averageScore = totalScore / (result.totalTeacher || 0);

            callback(null, result);
        });

        teacherGroup.teachers.forEach(function(teacher) {

            // 2. 针对每个老师生成单独的报告
            createReport(teacher, indGroups, ep.group('teacherGroup.teachers.forEach'));
        });

    });


}


/**
 * 评分报表列表
 */
exports.report = function(req, res) {


    var parameter = req.parameter;

    var startTime = Date.now();

    createIndicatorReport(parameter, function(err, result) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        res.json({
            err: ERR.SUCCESS,
            result: result
        });
        Logger.info('[IndicatorScore.report] end, cost: ', Date.now() - startTime, 'ms');

    });

};



/**
 * 评分人列表和互评得分
 *
 */
function calculateTeacherEOIScores(parameter, callback) {
    var term = parameter.term;
    var appraiseeId = parameter.appraiseeId;

    var ep = new EventProxy();

    ep.fail(callback);

    // 拉被评分人
    var param = {
        term: term,
        teachers: {
            $elemMatch: {
                id: appraiseeId,
                value: {
                    $gt: 0
                }
            }
        },
        id: {
            $ne: appraiseeId
        }

    };



    Logger.debug('[calculateTeacherEOIScores] query', param);
    db.RelationShips.find(param, function(err, ships) {
        if (err) {
            return callback(err);
        }
        var results = [];
        var totalScore = 0;

        ep.after('handleShips', ships.length * 3, function() {
            callback(null, {
                summary: {
                    totalScore: totalScore,
                    averageScore: totalScore / (results.length || 0)
                },
                appraisers: results
            });
        });

        ships.forEach(function(ship) {
            // 1. 拉评分人所在教师分组, 
            // 2. 拉评分人的打分结果, 
            // 3. 拉打分用的问卷
            var evaluationType = 0;
            for (var i = 0; i < ship.teachers.length; i++) {
                if (ship.teachers[i].id === appraiseeId) {
                    evaluationType = ship.teachers[i].value;
                    break;
                }
            }

            var result = {
                id: ship.id,
                name: ship.name,
                teacherGroup: null,
                eoIndicateScore: null,
                questionnare: null
            };
            results.push(result);
            var count = 0;

            // 1.
            db.TeacherGroups.findOne({
                term: term,
                'teachers.id': ship.id
            }, {
                id: 1,
                name: 1
            }, ep.group('handleShips', function(doc) {
                result.teacherGroup = doc;
                console.log(ship.id, count++, evaluationType);
            }));

            // 2.
            param = {
                term: term,
                appraiseeId: appraiseeId,
                appraiserId: ship.id,
                type: 0
            };
            Logger.debug('[calculateTeacherEOIScores#EOIndicateScores.findOne] query', param);
            db.EOIndicateScores.findOne(param, ep.group('handleShips', function(doc) {
                if (doc) {
                    result.eoIndicateScore = doc;
                    totalScore += doc.totalScore;
                    console.log(ship.id, count++);
                }

            }));

            // 3.
            db.Questionnaires.findOne({
                term: term,
                order: evaluationType
            }, ep.group('handleShips', function(doc) {
                result.questionnare = doc;
                console.log(ship.id, count++);
            }));
        });

    });
}


/**
 * 列出学生打分列表
 */
function calculateStudentEOIScores(parameter, callback) {

    var term = parameter.term;
    var appraiseeId = parameter.appraiseeId;

    var ep = new EventProxy();

    ep.fail(callback);


    var results = [];
    var totalScore = 0;
    var questionnare = null;

    // 1. 拉教师所在班级, 
    // 2. 拉属于这些班级的所有学生, 
    // 3. 拉学生的打分结果
    // 4. 拉打分用的问卷
    ep.after('handleShips', 2, function() {

        callback(null, {
            summary: {
                totalScore: totalScore,
                averageScore: totalScore / (results.length || 0)
            },
            questionnare: questionnare,
            students: results
        });
    });

    // 先确认被评分人是否需要生评
    var param = {
        term: term,
        // student: 1,
        id: appraiseeId
    };

    db.RelationShips.findOne(param, function(err, ship) {
        if (err) {
            return callback(err);
        }

        if (!ship) {
            return callback('没有配置该教师的互评关系');
        } else if (!ship.student) {
            return callback('该教师不需要生评');
        }

        // 1.
        db.Teachers.findOne({
            term: term,
            id: appraiseeId
        }, ep.doneLater('Teachers.findOne'));

        // 4.
        db.Questionnaires.findOne({
            term: term,
            order: ship.student
        }, ep.group('handleShips', function(doc) {
            questionnare = doc;
        }));

    }); // end RelationShips.findOne


    ep.on('Teachers.findOne', function(tgroup) {

        if (!tgroup) {
            return callback('该教师没有配置班级信息');
        }

        var classes = [];
        tgroup.classes.forEach(function(cls) {
            classes.push({
                'class': cls['class'],
                grade: cls.grade
            });
        });

        // 2.
        param = {
            term: term,
            $or: classes
        };
        Logger.debug('[calculateStudentEOIScores#Students.find] query', param);
        db.Students.find(param, ep.done('Students.find'));
    });

    ep.on('Students.find', function(students) {

        if (!students.length) {
            return ep.group('handleShips')();
        }
        students.forEach(function(student) {

            var result = {
                id: student.id,
                name: student.name,
                'class': student['class'],
                grade: student.grade,
                eoIndicateScore: null
            };
            results.push(result);

            // 3.
            param = {
                term: term,
                appraiseeId: appraiseeId,
                appraiserId: student.id,
                type: 1
            };
            Logger.debug('[calculateStudentEOIScores#EOIndicateScores.findOne] query', param);
            db.EOIndicateScores.findOne(param, ep.group('handleShips', function(doc) {
                if (doc) {
                    result.eoIndicateScore = doc;
                    totalScore += doc.totalScore;
                }

            }));

        });

    }); // end Students.find


}

/**
 * 互评和生评详情
 */
exports.detail = function(req, res) {
    var parameter = req.parameter;
    var term = parameter.term;
    var appraiseeId = parameter.appraiseeId;
    // 报表类型, 1: 互评明细, 2: 生评明细
    var type = parameter.type;

    var startTime = Date.now();

    function callback(err, result) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        Logger.info('[IndicatorScore.detail] type: ', type, 'time cost: ', Date.now() - startTime);
        res.json({
            err: ERR.SUCCESS,
            result: result
        });
    }

    if (type === 1) {

        calculateTeacherEOIScores(parameter, callback);
    } else if (type === 2) {

        calculateStudentEOIScores(parameter, callback);
    } else {
        res.json({
            err: ERR.PARAM_ERROR,
            msg: 'type 只能取值 1: 互评明细, 2: 生评明细'
        });
    }
};

/**
 * 导出报表
 */
exports.export = function(req, res) {
    // TODO
};