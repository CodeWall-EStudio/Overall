var EventProxy = require('eventproxy');

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
            scores: [],
            totalScore: item['总分'] || 0
        };

        group.indicators.forEach(function(indicator) {
            doc.scores.push({
                indicator: indicator,
                score: item[indicator.name] || 0
            });
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

/**
 * 计算混有互评的总分
 * @param  {[type]}   result   [description]
 * @param  {[type]}   indScore [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function calculateEvaluationScores(result, indScore, callback) {

    var indGroup = indScore.indicatorGroup;
    var cacheMap = {};

    indGroup.indicators.forEach(function(indicator) {
        cacheMap[indicator._id] = indicator;
    });

    delete indGroup.indicators;

    var ep = new EventProxy();
    ep.fail(callback);

    Logger.debug('[indScore.scores]', indScore.scores);

    ep.after('countScore', indScore.scores.length, function(list) {
        Logger.debug('[IndicatorScore.report#calculateEvaluationScores] countScore: ', list);

        var totalScore = Util.calculate(list);
        result.totalScore = totalScore;

        callback(null);
    });

    // 检查下这个 group 有没有互评和生评
    indScore.scores.forEach(function(sco) {

        var ind = cacheMap[sco.indicator];
        var checkScoreDone = ep.group('countScore');
        if (ind.gatherType === 2 || ind.gatherType === 3) {
            // 互评平均分, 所有老师对他的打分的平均分
            var param = {
                term: indScore.term,
                appraiseeId: indScore.teacherId
            };
            param.type = ind.gatherType === 2 ? 0 : 1;

            db.EOIndicateScores.find(param, function(err, docs) {
                if (err) {
                    return ep.emit('error', err);
                }
                if (docs.length) {
                    var totalScore = 0;
                    docs.forEach(function(doc) {
                        totalScore += doc.totalScore || 0;
                    });
                    Logger.debug('[IndicatorScore.report#calculateScores]', 'ind.gatherType=', ind.gatherType, ' 平均分: ', totalScore / docs.length);
                    checkScoreDone(null, totalScore / docs.length);
                } else {
                    Logger.debug('[IndicatorScore.report#calculateScores]', 'ind.gatherType=', ind.gatherType, ' 平均分: ', 0);
                    checkScoreDone(null, 0);
                }
            });
        } else {
            checkScoreDone(null, sco.score);
        }
    });
}


function calculateScores(teacher2Scores, callback) {

    var results = [];
    var ep = new EventProxy();

    ep.fail(callback);

    ep.after('teacher2Scores', teacher2Scores.length, function(list) {
        callback(null, results);
    });

    // indScores 的 totalScore 是已经计算好了的, 
    // 这里只要再看看哪些指标组还有互评和生评的就可以了
    [].forEach.call(teacher2Scores, function(teacherScore) {

        var result = {
            teacherId: teacherScore.teacherId,
            teacherName: teacherScore.teacherName,
            indicatorGroupScores: []
        };

        results.push(result);

        ep.after('indicatorScores', teacherScore.indicatorScores.length, function() {

            ep.group('teacher2Scores')(null);
        });

        teacherScore.indicatorScores.forEach(function(indScore) {

            var scoreObj = indScore.indicatorGroup;
            // delete scoreObj.indicators;
            result.indicatorGroupScores.push(scoreObj);

            if (scoreObj.hasEvaluation) {
                // 需要处理互评的记录
                delete scoreObj.hasEvaluation;
                calculateEvaluationScores(scoreObj, indScore, ep.group('indicatorScores'));
            } else {
                scoreObj.totalScore = indScore.totalScore;
                delete scoreObj.indicators;
                ep.group('indicatorScores')(null);
            }

        });

    }); // end [].forEach.call

}

exports.summary = function(req, res) {


    var parameter = req.parameter;
    var term = parameter.term;
    var teacherGroup = parameter.teacherGroup;
    var teacherName = parameter.teacherName;

    var param = {
        term: term
    };

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

    Logger.debug('[IndicatorScore.summary] query: ', param);

    var reportStart = Date.now();

    // Logger.debug('[IndicatorScore.report] query: ', param);
    db.IndicatorScores.find(param, null, {
        sort: {
            teacherId: 1
        }
    }, function(err, indScores) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        // 不指定指标组则输出报表概览, 要先列出所有指标组, 然后计算每个指标组的总分

        // 找出所有指标组, 有生评和互评的指标组, 总分还要另外再计算
        // 这里其实不用那么麻烦的, 可以写死某个指标组就一定有互评生评
        // 但是这样会导致修改指标组的指标类型时很麻烦
        // 还是设计通用一点吧: 
        // 查询每个指标组的指标, 检查指标类型, 是互评生评的, 就取计算互评生评平均分
        db.IndicatorGroups.find({
                term: term
            }, null, {
                sort: {
                    order: 1
                }
            },

            function(err, indGroups) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }

                var id2Groups = {
                    length: 0
                };
                // 先把指标组以及下面的指标们都用 _id 索引, 方便查找
                indGroups.forEach(function(group) {
                    group = group.toObject();
                    id2Groups[group._id] = group;
                    id2Groups[id2Groups.length++] = group;

                    // 先把有互评生评的指标组表示出来
                    for (var i = 0; i < group.indicators.length; i++) {
                        if (group.indicators[i].gatherType !== 1) {
                            group.hasEvaluation = true;
                            break;
                        }
                    }
                });

                // 先把得分按教师归类, 已事先按 teacherId 排序
                var teacher2Scores = {
                    length: 0
                };
                indScores.forEach(function(indScore) {
                    var item = teacher2Scores[indScore.teacherId];
                    if (!item) {
                        item = teacher2Scores[indScore.teacherId] = {
                            teacherId: indScore.teacherId,
                            teacherName: indScore.teacherName,
                            indicatorScores: []
                        };
                        teacher2Scores[teacher2Scores.length++] = item;
                    }
                    // 把指标组详情传过去
                    indScore = indScore.toObject();
                    indScore.indicatorGroup = id2Groups[indScore.indicatorGroup];
                    item.indicatorScores.push(indScore);
                });

                // 计算总分和计算互评生评份
                calculateScores(teacher2Scores, function(err, results) {
                    if (err) {
                        return res.json({
                            err: ERR.SERVER_ERROR,
                            msg: err
                        });
                    }
                    res.json({
                        err: ERR.SUCCESS,
                        result: results
                    });
                    Logger.info('[IndicatorScore.summary] end, cost: ', Date.now() - reportStart, 'ms, query: ', param);
                });

            }
        );

    });

};

exports.report = function(req, res) {


    var parameter = req.parameter;
    var term = parameter.term;
    var teacherGroup = parameter.teacherGroup;
    var teacherName = parameter.teacherName;
    var indicatorGroup = parameter.indicatorGroup;

    var param = {
        term: term
    };

    if (indicatorGroup) {
        param.indicatorGroup = indicatorGroup;
    }

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

    Logger.debug('[IndicatorScore.report] query: ', param);

    var reportStart = Date.now();

    // Logger.debug('[IndicatorScore.report] query: ', param);
    db.IndicatorScores.find(param, null, {
        sort: {
            teacherId: 1
        }
    }, function(err, indScores) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        // 报表详情, 根据条件搜索 IndicatorScores 就可以了
        res.json({
            err: ERR.SUCCESS,
            result: indScores
        });
        Logger.info('[IndicatorScore.report] end, cost: ', Date.now() - reportStart, 'ms, query: ', param);

    });

};

exports.detail = function(req, res) {

};