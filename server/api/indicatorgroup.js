var db = require('../modules/db');

var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');



exports.create = function(req, res){
    var parameter = req.parameter;


    db.IndicatorGroups.create(parameter, function(err, doc){
        if(err){
            return res.json({ err: ERR.DB_ERROR, msg: '创建指标组失败', detail: err });
        }
        res.json({ err: ERR.SUCCESS, result: doc });
    });
};


exports.list = function(req, res){

    db.IndicatorGroups.find({}, function(err, docs){
        if(err){
            return res.json({ err: ERR.DB_ERROR, msg: '获取指标组失败', detail: err });
        }
        res.json({ err: ERR.SUCCESS, result: docs });
    });

};

