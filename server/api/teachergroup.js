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


    var termId = term.toObject()._id;
    var docs = [];
    data.forEach(function(item) {

        var doc = {
            term: termId,
            teacherId: item['教师用户名'],
            teacherName: item['教师姓名'],
            order: item['分组代码'],
            name: item['分组名称']
        };
        docs.push(doc);
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
                msg: '成功导入' + (docs.length) + '条数据'
            });
        });
    });
};