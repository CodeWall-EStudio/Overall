var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');

var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.import = function(req, res) {

    var parameter = req.parameter;
    var group = parameter.indicatorGroup;
    var data;
    try {
        var workbook = XLS.readFile(req.files.file.path);
        data = XLS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } catch (e) {
        return res.json({
            err: ERR.IMPORT_FAILURE,
            msg: '导入失败',
            detail: e.message
        });
    }

    if (!data.length) {
        return res.json({
            err: ERR.IMPORT_FAILURE,
            msg: '没有数据要导入'
        });
    }

    var indicatorNames = [];
    var groupObj = group.toObject();
    groupObj.indicators.forEach(function(doc) {
        indicatorNames.push(doc.name);
    });

    var docs = [];
    data.forEach(function(item) {
        var doc = {
            teacherId: item['教师用户名'],
            teacherName: item['教师姓名'],
            term: groupObj.term,
            indicatorGroup: groupObj._id,
            scores: [],
            totalScore: item['总分'] || 0
        };

        indicatorNames.forEach(function(name) {
            doc.scores.push(item[name] || 0);
        });

        docs.push(doc);
    });

    db.IndicatorScores.remove({
        indicatorGroup: groupObj._id
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

exports.report = function(req, res) {
    //var parameter = req.parameter;

    var parameter = req.parameter;
    var term = parameter.term;
    var teacherGroup = parameter.teacherGroup;

    var param  = {
        term: term.toObject()._id
    }
    if(teacherGroup){
        param.teacherGroup = teacherGroup;
    }

    db.IndicatorScores.find(param,function(err,docs){
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });
    
};

exports.detail = function(req, res){

};