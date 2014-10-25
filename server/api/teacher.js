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


    var termId = term;
    var docs = [];
    var map = {};
    data.forEach(function(item) {
        var id = item['教师用户名'];
        var doc = map[id];
        if (!doc) {
            doc = map[id] = {
                term: termId,
                id: id,
                name: item['教师姓名'],
                classes: []
            };
            docs.push(doc);
        }
        doc.classes.push({
            grade: item['年级'],
            'class': item['班级']
        });
        
    });


    // 导入前先清空数据
    db.Teachers.remove({
        term: termId
    }, function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        db.Teachers.create(docs, function(err) {
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