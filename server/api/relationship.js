var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');


exports.list = function(req,res){

    var parameter = req.parameter;
    var term = parameter.term;

    var param  = {
        term: term.toObject()._id
    }

    db.RelationShips.find(param,function(err,docs){
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

}

/**
 *  教师用户名   教师姓名    生评  zhangsan    lisi    wangwu  zhaoliu
    教师用户名   教师姓名    生评  张三  李四  王五  赵六
    zhangsan    张三  1   2   2   0   0
    lisi    李四  1   3   3   0   0
    wangwu  王五  0   0   0   4   4
    zhaoliu 赵六  0   0   0   0   0
 */
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
    var nameMap;
    // 第一行是 英文名(已经变成每个元素的key), 第二行是 中文名
    data.forEach(function(item, i) {
        if (i === 0) {
            nameMap = item;
            return;
        }

        var doc = {
            term: termId,
            id: item['教师用户名'],
            name: item['教师姓名'],
            student: item['生评'] || 0,
            teachers: []
        };
        docs.push(doc);

        for (var key in item) {
            if (['教师用户名', '教师姓名', '生评'].indexOf(key) > -1 || key.indexOf('__') > -1) {
                continue;
            }
            doc.teachers.push({
                id: key,
                name: nameMap[key],
                value: item[key]
            });
        }

    });


    // 导入前先清空数据
    db.RelationShips.remove({
        term: termId
    }, function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }

        db.RelationShips.create(docs, function(err) {
            if (err) {
                return dbHelper.handleError(err, res);
            }

            res.json({
                err: ERR.SUCCESS,
                result: Array.prototype.slice.apply(arguments).slice(1),
                msg: '成功导入' + (docs.length) + '条数据'
            });
        });
    });
};