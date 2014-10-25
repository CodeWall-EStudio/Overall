var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var fileHelper = require('../modules/file_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');



exports.create = function(req, res) {
    var parameter = req.parameter;

    var term = parameter.term;

    db.IndicatorGroups.create({
        name: parameter.name,
        order: parameter.order,
        weight: parameter.weight,
        score: parameter.score,
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


exports.list = function(req, res) {

    var parameter = req.parameter;

    var term = parameter.term;

    db.IndicatorGroups.find({
            term: term
        }, null, {
            sort: {
                order: 1
            }
        },
        function(err, docs) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            res.json({
                err: ERR.SUCCESS,
                result: docs
            });
        });

};