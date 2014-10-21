var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.create = function(req, res) {

    var parameter = req.parameter;

    db.Terms.create({
        name: parameter.name,
        order: parameter.order || 0,

        status: 0 // 0: 未激活, 1: 激活, 2: 关闭, 4: 评价完成
    }, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: doc.toJSON()
        });
    });
};

exports.list = function(req, res) {

    db.Terms.find({}, function(err, docs) {

        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};

exports.modify = function(req, res) {

    var parameter = req.parameter;
    var term = parameter.term;

    if (parameter.name) {
        term.name = parameter.name;
    }
    if (parameter.order) {
        term.order = parameter.order;
    }
    if (parameter.status) { // status 一旦经过设定值, 就不能再设置回 0
        term.status = parameter.status;
    }

    term.save(function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok',
            result: doc
        });
    });

};

exports.delete = function(req, res) {

    var term = req.parameter.term;

    term.remove(function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    });

};