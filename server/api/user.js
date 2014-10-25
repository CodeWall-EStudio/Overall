var querystring = require('querystring');
var EventProxy = require('eventproxy');

var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


function pickupUsers(root, callback) {


    if (root.classes === 'department') {
        var children = root.children || [];
        var ep = new EventProxy();
        ep.fail(callback);

        ep.after('departmentChildren', children.length, function(list) {
            var results = [];

            list.forEach(function(l) {
                results = results.concat(l);
            });

            callback(null, results);
        });

        children.forEach(function(child) {

            pickupUsers(child, ep.group('departmentChildren'));
        });
    } else if (root.classes === 'user') {
        callback(null, {
            id: root.loginName,
            name: root.name,
            role: 0,
            status: 0
        });
    } else {
        callback(null);
    }

}

exports.import = function(req, res) {

    var user = req.session.user;

    var data = querystring.stringify({
        key: user.skey,
        loginName: user.name
    });

    Util.request({
        url: config.CAS_ORG_TREE_CGI,
        method: 'POST',
        data: data,
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }

    }, function(err, data) {
        if (err) {
            return res.json({
                err: ERR.IMPORT_FAILURE,
                msg: '拉取学校教师数据失败',
                detail: err
            });
        }
        try {
            data = JSON.parse(data);
        } catch (e) {
            return res.json({
                err: ERR.IMPORT_FAILURE,
                msg: '数据格式有误',
                detail: e.message
            });
        }

        if (!data.success || !data.departmentTree) {
            return res.json({
                err: ERR.IMPORT_FAILURE,
                msg: 'SSO返回数据错误',
                detail: data.resultMsg
            });
        }

        pickupUsers(data.departmentTree, function(err, results) {
            if (err) {
                return res.json({
                    err: ERR.IMPORT_FAILURE,
                    msg: '处理用户数据失败',
                    detail: err
                });
            }

            db.Users.remove(function(err) {
                if (err) {
                    return dbHelper.handleError(err, res);
                }
                db.Users.create(results, function(err) {
                    if (err) {
                        return dbHelper.handleError(err, res);
                    }
                    res.json({
                        err: ERR.SUCCESS,
                        msg: '成功导入' + (arguments.length - 1) + '条数据'
                    });
                });
            }); // end Users.remove

        }); // end pickupUsers

    }); // end Util.request
};


/**
 * 获取登陆用户的信息
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.info = function(req, res) {

    var loginUser = req.loginUser;

    // loginUser.role === 1
    // 学生
    (loginUser.role === 1 ? db.Students : db.Users).findOne({
        id: loginUser.id
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

/**
 * 按名字搜索用户
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.search = function(req, res) {
    var parameter = req.parameter;

    var keyword = parameter.keyword;

    var param = {};
    if (keyword) {
        var reg = new RegExp('.*' + Util.encodeRegexp(keyword) + '.*');
        param['$or'] = [{
            'id': reg
        }, {
            'name': reg
        }];
    }

    db.Users.find(param, function(err, docs) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            result: docs
        });
    });

};

exports.auth = function(req, res) {

    var parameter = req.parameter;

    db.Users.update({
        id: parameter.id
    }, {
        role: parameter.role
    }, {
        upsert: true,
        multi: true
    }, function(err) {
        if (err) {
            return dbHelper.handleError(err, res);
        }
        res.json({
            err: ERR.SUCCESS,
            msg: 'ok'
        });
    });

};