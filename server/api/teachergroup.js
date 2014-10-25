var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

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
    var map = {};
    data.forEach(function(item) {
        var id = item['分组代码'];
        var doc = map[id];
        if (!doc) {
            doc = map[id] = {
                term: termId,
                id: id,
                name: item['分组名称'],
                teachers: []
            };
            docs.push(doc);
        }
        doc.teachers.push({
            id: item['教师用户名'],
            name: item['教师姓名'],
        });

    });

    // 导入前先清空数据
    db.TeacherGroups.remove({
        term: termId
    }, function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        db.TeacherGroups.create(docs, function(err) {
            if (err) {
                return dbHelper.handleError(err, res);
            }

            res.json({
                err: ERR.SUCCESS,
                msg: '成功导入' + (data.length) + '条数据'
            });
        });
    });
};



exports.list = function(req, res) {

    var parameter = req.parameter;

    var term = parameter.term;

    db.TeacherGroups.find({
            term: term
        }, null, {
            sort: {
                id: 1
            }
        },

        function(err, docs) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            res.json({
                err: ERR.SUCCESS,
                result: docs
            });
        });

};