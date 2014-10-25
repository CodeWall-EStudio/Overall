var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


/**
 * 列出被评价者
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.appraisees = function(req, res){
    var parameter = req.parameter;
    var evaluationType = parameter;

    var loginUser = req.loginUser;
    var term = parameter.term;

    var param = {
        term: term.toObject()._id,
        id: loginUser.id
    };

    db.RelationShips.findOne(param, function(err, doc){
        if (err) {
            return dbHelper.handleError(err, res);
        }
        var results = [];
        doc.teachers.forEach(function(teacher){
            if(teacher.value){
                results.push(teacher);
            }
        });
        res.json({
            err: ERR.SUCCESS,
            result: results
        });
    });

};

exports.appraise = function(req, res){

};