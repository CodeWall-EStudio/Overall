var db = require('../modules/db');

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

    // 先清空原来的数据
    // db.Indicators.remove({
    //     indicatorGroupId: group._id
    // }, function(err) {
    //     if (err) {
    //         return res.json({
    //             err: ERR.DB_ERROR,
    //             msg: '删除旧数据失败',
    //             detail: err
    //         });
    //     }
    var docs = [];
    data.forEach(function(item) {
        var doc = {
            // indicatorGroupId: group._id,
            name: item['名称'],
            order: item['序号'],
            score: item['分值'],
            gatherType: item['采集方式'] || 0,
            desc: item['说明']
        };
        docs.push(doc);
    });
    group.indicators = docs;
    group.save(function(err) {
        if (err) {
            return res.json({
                err: ERR.IMPORT_FAILURE,
                msg: '插入数据失败',
                detail: err
            });
        }
        res.json({
            err: ERR.SUCCESS,
            msg: '成功导入' + (docs.length) + '条数据'
        });
    });

    // db.Indicators.create(docs, function(err) {
    //     if (err) {
    //         return res.json({
    //             err: ERR.IMPORT_FAILURE,
    //             msg: '插入数据失败',
    //             detail: err
    //         });
    //     }
    //     res.json({
    //         err: ERR.SUCCESS,
    //         msg: '成功导入' + (arguments.length - 1) + '条数据'
    //     });
    // });

    // });
};


exports.list = function(req, res) {

    var group = req.parameter.indicatorGroup;

    // db.Indicators.find({
    //     indicatorGroupId: group._id
    // }, function(err, docs) {
    //     if (err) {
    //         return res.json({
    //             err: ERR.DB_ERROR,
    //             msg: '获取指标列表失败',
    //             detail: err
    //         });
    //     }
    res.json({
        err: ERR.SUCCESS,
        result: group.indicators
    });
    // });

};