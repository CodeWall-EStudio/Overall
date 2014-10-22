

var EventProxy = require('eventproxy');
var us = require('underscore');

exports.AUTH_WHITE_LIST = [
    '/api/login',
    '/api/login/callback',
    '/api/login/student',
    '/api/login/logout'
];

exports.RULES = {
    
    // system
    // '/api/system/*': { // 系统初始化相关的接口, 只有系统管理员有权限

    //     verify: function(user, parameter, callback){

    //         if(user.__role & config.AUTH_SYS_MANAGER){

    //             return callback(null);
    //         }
    //         return callback('no auth');
    //     }
    // },

};

