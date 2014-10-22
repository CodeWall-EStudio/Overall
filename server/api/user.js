var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


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
        return res.json({
            err: ERR.SUCCESS,
            result: data
        });
    });
};