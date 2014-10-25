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
exports.appraisees = function(req, res) {
    var parameter = req.parameter;
    var evaluationType = parameter.evaluationType;

    var loginUser = req.loginUser;
    var term = parameter.term;

    var param;

    // TODO 这里还要判断权限 role
    if (evaluationType === 1) { // 学生评价老师
        // 先拉学生所在的班级
        db.Students.findOne({
            id: loginUser.id
        }, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            // 通过班级找到对应的老师们
            param = {
                'classes.grade': doc.grade,
                'classes.class': doc['class']
            };
            Logger.debug('[evaluation.appraisees] evaluationType: ', evaluationType, 'query: ', param);
            db.Teachers.find(param, {
                id: 1,
                name: 1
            }, function(err, docs) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }
                res.json({
                    err: ERR.SUCCESS,
                    result: docs
                });
            });
        });

    } else { // 互评
        param = {
            term: term.toObject()._id,
            id: loginUser.id
        };

        db.RelationShips.findOne(param, function(err, doc) {
            if (err) {
                return dbHelper.handleError(err, res);
            }
            if (!doc) {
                return res.json({
                    err: ERR.NOT_FOUND,
                    msg: '没有找到对应互评关系'
                });
            }
            var results = [];
            doc.teachers.forEach(function(teacher) {
                if (teacher.value) {
                    results.push(teacher);
                }
            });
            res.json({
                err: ERR.SUCCESS,
                result: results
            });
        });
    }

};

exports.appraise = function(req, res) {

};