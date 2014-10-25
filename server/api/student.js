var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

//学生列表
exports.list = function(req, res) {

    var parameter = req.parameter;
    var term = parameter.term;
    var grade = parameter.grade;
    var cls = parameter.cls;

    var param  = {
        term: term
    }
    if(grade){
        param.grade = grade;
    }
    if(cls){
        param['class'] = cls;
    }

    db.Students.find(param,function(err,docs){
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};

exports.import = function(req, res) {

    var parameter = req.parameter;
    var term = parameter.term;

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


    var termId = term;
    var docs = [];
    data.forEach(function(item) {

        var doc = {
            term: termId,
            grade: item['年级'],
            'class': item['班级'],
            name: item['姓名'],
            id: item['教育Id']
        };
        docs.push(doc);
    });


    // 导入前先清空数据
    db.Students.remove({
        term: termId
    }, function(err){
        if (err) {
            return dbHelper.handleError(err, res);
        }

        db.Students.create(docs, function(err) {
            if (err) {
                return dbHelper.handleError(err, res);
            }

            res.json({
                err: ERR.SUCCESS,
                msg: '成功导入' + (docs.length) + '条数据'
            });
        });
    });
};