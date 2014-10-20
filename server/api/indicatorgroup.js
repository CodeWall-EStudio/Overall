var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');



exports.create = function(req, res) {
    var parameter = req.parameter;


    db.IndicatorGroups.create(parameter, function(err, doc) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: doc
        });
    });
};


exports.list = function(req, res) {

    db.IndicatorGroups.find({}, function(err, docs) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};