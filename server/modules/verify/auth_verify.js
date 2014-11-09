var EventProxy = require('eventproxy');
var us = require('underscore');

var db = require('../../modules/db');
var ERR = require('../../errorcode.js');
var Util = require('../../util');
var Logger = require('../../logger');
var config = require('../../config');
var AuthConfig = require('./auth_config');



/**
 * 检查是否登录, 如果登录了, 从数据库把用户信息找出
 */
exports.checkAuth = function(req, res, next) {
    var path = req.redirectPath || req.path;
    var method = req.method;
    var skey = req.cookies.skey || req.body.skey || req.query.skey;
    req.skey = skey;

    // Logger.debug('[checkAuth]', 'req.redirectPath: ', req.redirectPath);

    if (AuthConfig.AUTH_WHITE_LIST.indexOf(path) >= 0) {
        Logger.info('[checkAuth] white list skip.', 'path: ', path, ', method: ', method);
        return next();
    }


    var loginUser;
    if (!req.session || !skey || !(loginUser = req.session.user)) {
        res.json({
            err: ERR.NOT_LOGIN,
            msg: 'not login'
        });
        Logger.info('[checkAuth] not login.', 'path: ', path, ', method: ', method, ', skey: ', skey);
        return;
    }

    req.loginUser = loginUser;
    Logger.debug('[checkAuth]', 'loginUser: ', loginUser);
    next();

};

/**
 * 检查 api 调用权限, 所有 api 权限检查都在这里完成, api 的具体实现里就不在涉及跟权限有关的代码
 * 这里会检查用户的所有角色, 包括用户角色, 文件角色, 文件夹角色, 小组角色等
 */
exports.checkAPI = function(req, res, next) {
    var path = req.redirectPath || req.path;
    var method = req.method;
    var loginUser = req.loginUser;
    var parameter = req.parameter;

    if (AuthConfig.AUTH_WHITE_LIST.indexOf(path) >= 0) {
        Logger.info('[checkAPI] white list skip', 'path: ', path, ', method: ', method);
        return next();
    }

    var ep = new EventProxy();
    ep.fail(function(err, errCode) {

        Logger.info('[checkAPI]', errCode, ':', err, 'path: ', path, ', method: ', method);
        res.json({
            err: errCode || ERR.SERVER_ERROR,
            msg: err
        });
    });


    /*
     * 检查该用户是否有权限调用该 api, 同时还会涉及稍微跟api实现有关的权限检查
     * 如: file/move, 会检查当前文件是否是用户可操作的, 木有文件夹是否是用户可操作的等等
     */
    checkAPIAuth(path, loginUser, parameter, ep.done('checkAPIAuthDone'));

    ep.on('checkAPIAuthDone', function() {
        // 权限没有问题, 如果有问题, 就抛出 error 事件
        next();
        Logger.debug('[checkAPI] checkAPIAuthDone.', 'path: ', path, ', method: ', method);
    });
};


function getAuthRule(path) {
    // TODO 支持多条规则依次验证
    var rule = AuthConfig.RULES[path];
    if (!rule) {
        for (var i in AuthConfig.RULES) {
            var reg = new RegExp(i.replace(/\//g, '\\/').replace(/\*/g, '.*').replace(/\?/g, '.+'));
            if (reg.test(path)) {
                Logger.debug('[getAuthRule] ' + path + ' match ' + i);
                return AuthConfig.RULES[path];
            }
        }
    }
    return rule;
}

function checkAPIAuth(path, user, parameter, callback) {
    if (AuthConfig.AUTH_WHITE_LIST.indexOf(path) > -1) {
        return callback(null);
    }
    var rule = getAuthRule(path);
    if (!rule || !rule.verify) {
        return callback(null);
    }
    rule.verify(user, parameter, callback);
}