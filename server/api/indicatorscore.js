var db = require('../modules/db');

var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.import = function(req, res){
    
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
    group.toObject().indicators.forEach(function(doc){
        indicatorNames.push(doc.name);
    });

    var docs = [];
    data.forEach(function(item) {
        var doc = {
            uid: item['账号'],
            uname: item['姓名'],
            scores: [],
            totalScore: item['总分'] || 0
        };

        indicatorNames.forEach(function(name){
            doc.scores.push(item[name] || 0 );
        });

        docs.push(doc);
    });


    db.IndicatorScores.create(docs, function(err){

        if (err) {
            return res.json({
                err: ERR.IMPORT_FAILURE,
                msg: '插入数据失败',
                detail: err
            });
        }
        res.json({
            err: ERR.SUCCESS,
            msg: '成功导入' + (arguments.length - 1) + '条数据'
        });
    });

};