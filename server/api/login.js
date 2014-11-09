var querystring = require('querystring');

var CAS = require('../modules/cas');
var db = require('../modules/db');
var dbHelper = require('../modules/db_helper');
var fileHelper = require('../modules/file_helper');
var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


function cas(req, res) {
    if (!cas.ins) {
        cas.ins = new CAS({
            base_url: config.CAS_BASE_URL,
            service: req.appDomain + '/api/login/callback'
        });
    }
    return cas.ins;
}

/**
 * 教师登录
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.get = function(req, res) {

    var url = cas(req, res).login();
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

    cas(req, res).validate(ticket, function(err, status, data) {

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
        user.role = 2; //'teacher';

        req.session.user = user;
        res.cookie('skey', data.encodeKey);

        decode(data.encodeKey, function(err, data) {

            if (err) {
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: err
                });
            }

            if (!data.success) {
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: data.resultMsg
                });
            }
            data = data.userInfo;
            // Logger.debug(data);

            user.name = data.name;
            user.open_id = data.id;

            db.Users.findOne({
                id: user.id
            }, function(err, doc) {
                if (err) {
                    return res.json({
                        err: ERR.LOGIN_FAILURE,
                        msg: err
                    });
                }
                if (doc) {
                    user.status = doc.status;
                    user.role = doc.role;
                } else {
                    user.status = 0;
                    user.role = 2;
                }
                if(user.id === 'hongyuan'){
                    // hongyuan 强制设置为系统管理员
                    user.role = 16;
                }

                db.Users.update({
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

            }); // end of db.Users.findOne

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

exports.student = function(req, res) {
    var parameter = req.parameter;

    db.Students.findOne({
        name: parameter.name,
        id: parameter.id
    }, function(err, student) {
        if (err) {
            return res.json({
                err: ERR.LOGIN_FAILURE,
                msg: err
            });
        }
        if (!student) {
            return res.json({
                err: ERR.ACCOUNT_ERROR,
                msg: '账号或密码错误'
            });
        }
        var studentObj = student.toObject();
        db.Terms.findById(studentObj.term, function(err, term) {
            if (err) {
                return res.json({
                    err: ERR.LOGIN_FAILURE,
                    msg: err
                });
            }
            if (term.status !== 1) {
                return res.json({
                    err: ERR.ACCOUNT_CLOSE,
                    msg: '没有激活的学期'
                });
            }
            var user = studentObj;
            var skey = Util.md5(user.name + ':' + user.id);

            user.role = 1; //'student';
            user.skey = skey;

            req.session.user = user;
            res.cookie('skey', skey);

            res.json({
                err: ERR.SUCCESS,
                result: {
                    // student: {
                    name: studentObj.name,
                    grade: studentObj.grade,
                    'class': studentObj['class']
                    // }
                }
            });
        });
    });
};

exports.logout = function(req, res) {
    req.session.destroy();

    res.clearCookie('skey');
    res.clearCookie('overall.sid');

    res.redirect(cas(req, res).logout());

};