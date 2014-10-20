var querystring = require('querystring');

var CAS = require('../modules/cas');
var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var cas = new CAS({
    base_url: config.CAS_BASE_URL,
    service: config.APP_DOMAIN + '/api/login/callback'
});

/**
 * 教师登录
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.get = function(req, res) {

    var url = cas.login();
    Logger.info('[login] redirect to: ' + url);
    res.redirect(url);

};


exports.callback = function(req, res) {

    var ticket = req.param('ticket');

    if (!ticket) {
        res.json({
            err: ERR.NOT_LOGIN
        });
        return;
    }

    cas.validate(ticket, function(err, status, data) {

        if (err) {
            return res.json({
                err: ERR.LOGIN_FAILURE,
                msg: err
            });
        } else if (!status) {
            return res.json({
                err: ERR.TICKET_ERROR,
                msg: 'cas ticket "' + ticket + '" 验证失败!'
            });
        }
        try {
            data = JSON.parse(data);
        } catch (e) {
            return res.json({
                err: ERR.LOGIN_FAILURE,
                msg: 'CAS返回的数据格式异常'
            });
        }


        var user = {};
        user.id = data.loginName;
        user.skey = data.encodeKey;

        req.session.user = user;
        res.cookie('skey', data.encodeKey);

        decode(data.encodeKey, function(err, data) {

            if (err) {
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: err
                });
            }

            if(!data.success){
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: data.resultMsg
                });
            }
            data = data.userInfo;
            // Logger.debug(data);

            user.nick = data.name;
            user.open_id = data.id;

            db.Teachers.findOne({
                id: user.id
            }, function(err, teacher) {
                if (err) {
                    return res.json({
                        err: ERR.LOGIN_FAILURE,
                        msg: err
                    });
                }
                if (teacher) {
                    user.status = teacher.status;
                    user.role = teacher.role;
                    return res.redirect(config.INDEX_PAGE);
                }
                user.status = 0;
                user.role = 0;
                db.Teachers.update({
                    id: user.id
                }, user, {
                    upsert: true,
                    multi: true
                }, function(err) {
                    if (err) {
                        return res.json({
                            err: ERR.LOGIN_FAILURE,
                            msg: err
                        });
                    }
                    return res.redirect(config.INDEX_PAGE);

                });
                
            }); // end of db.Teachers.findOne

        }); // end of decode

    }); // end of cas.validate

};


function decode(skey, callback) {

    var data = querystring.stringify({
        encodeKey: skey
    });

    Util.request({
        url: config.CAS_USER_INFO_CGI,
        method: 'POST',
        data: data,
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": data.length
        }

    }, function(err, data) {
        if (err) {
            callback(err);
        } else {
            try {
                if (!data) {
                    callback('the sso server does not return any thing');
                } else {
                    callback(null, JSON.parse(data));
                }
            } catch (e) {
                Logger.error('getUserInfo Error', data);
                callback('getUserInfo JSON parse error: ' + e.message);
            }
        }
    });
}