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
    var term = parameter.term;

    var data = fileHelper.readExcel(req, res);
    if (data === null) {
        return;
    }


    var docs = [];
    data.forEach(function(item) {

        var doc = {
            term: term,
            grade: item['年级'],
            'class': item['班级'],
            name: item['姓名'],
            id: item['教育Id']
        };
        docs.push(doc);
    });


    // 导入前先清空数据
    db.Students.remove({
        term: term
    }, function(err) {
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

//学生列表
exports.list = function(req, res) {

    var parameter = req.parameter;
    var term = parameter.term;
    var grade = parameter.grade;
    var cls = parameter.cls;

    var param = {
        term: term
    };
    if (grade) {
        param.grade = grade;
    }
    if (cls) {
        param['class'] = cls;
    }

    db.Students.find(param, function(err, docs) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};