var EventProxy = require('eventproxy');


var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var fileHelper = require('../modules/file_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.create = function(req, res) {

    var parameter = req.parameter;

    db.Terms.findOne({
        name: parameter.name
    }, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        if (doc) {
            return res.json({
                err: ERR.DUPLICATE,
                msg: '已经有这个名字了',
                duplicateKey: 'name'
            });
        }
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
    });


};

exports.list = function(req, res) {

    db.Terms.find({}, null, {
        sort: {
            name: 1
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

exports.modify = function(req, res) {

    var parameter = req.parameter;
    var term = parameter.term;

    var ep = new EventProxy();

    ep.fail(function(err) {
        res.json({
            err: ERR.SERVER_ERROR,
            msg: '后台出错了',
            detail: err
        });
    });


    if (parameter.order) {
        term.order = parameter.order;
    }
    if (parameter.status) { // status 一旦经过设定值, 就不能再设置回 0
        term.status = parameter.status;
    }
    if (parameter.name === term.name) {
        delete parameter.name;
    }
    if (parameter.name) {
        term.name = parameter.name;
        db.Terms.findOne({
            name: parameter.name
        }, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            if (doc) {
                return res.json({
                    err: ERR.DUPLICATE,
                    msg: '已经有同名的学期',
                    duplicateKey: 'name'
                });
            }
            ep.emit('nameOK');
        });
    } else {
        ep.emitLater('nameOK');
    }

    // status === 1 的只能有一个
    if (term.status === 1) {
        db.Terms.findOne({
            status: 1
        }, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            if (doc) {
                return res.json({
                    err: ERR.STATUS_DUPLICATE,
                    msg: '已经有激活的学期',
                    duplicateKey: 'status'
                });
            }
            ep.emit('statusOK');

        });
    } else {
        ep.emitLater('statusOK');

    }

    ep.all('statusOK', 'nameOK', function() {
        term.save(function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            res.json({
                err: ERR.SUCCESS,
                result: doc
            });
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