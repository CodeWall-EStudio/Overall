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
    var questionnaire = parameter.questionnaire;
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
            desc: item['说明']
        };
        docs.push(doc);
    });
    questionnaire.questions = docs;
    questionnaire.save(function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            msg: '成功导入' + (docs.length) + '条数据'
        });
    });

};

exports.create = function(req, res) {
    var parameter = req.parameter;

    var term = parameter.term;

    db.Questionnaires.create({
        name: parameter.name,
        order: parameter.order,
        term: term
    }, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: doc
        });
    });
};

exports.modify = function(req,res){
    var parameter = req.parameter;
    var questionnaire = parameter.questionnaire;   
     
    if(parameter.name){
        questionnaire.name = parameter.name;
    }

    questionnaire.save(function(err,doc){
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: doc
        });        
    });    
}


exports.list = function(req, res) {

    var parameter = req.parameter;

    var term = parameter.term;
    var param = {
        term: term
    };
    if (parameter.order) {
        param.order = parameter.order
    }

    db.Questionnaires.find(param, null, {
        sort: {
            order: 1
        }
    }, function(err, docs) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};

exports.detail = function(req, res) {
    var parameter = req.parameter;
    var questionnaire = parameter.questionnaireId;
    var order = parameter.order;
    if (questionnaire) {
        return res.json({
            err: ERR.SUCCESS,
            result: questionnaire
        });
    }
    if (!order) {
        return res.json({
            err: ERR.PARAM_ERROR,
            msg: 'questionnaireId 和 order 必须指定一个'
        });
    }
    db.Questionnaires.findOne({
        order: order
    }, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: doc
        });
    });

};