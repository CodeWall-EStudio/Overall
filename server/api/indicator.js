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
    if(data === null){
        return;
    }

    var docs = [];
    data.forEach(function(item) {
        var doc = {
            name: item['名称'],
            order: item['序号'],
            score: item['分值'],
            gatherType: item['采集方式'] || 1, // 1: 文件导入, 2: 互评平均分, 3: 生评平均分
            desc: item['说明']
        };
        docs.push(doc);
    });
    group.indicators = docs;
    group.save(function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            msg: '成功导入' + (docs.length) + '条数据'
        });
    });

};


exports.list = function(req, res) {

    var group = req.parameter.indicatorGroup;

    res.json({
        err: ERR.SUCCESS,
        result: group.indicators
    });

};