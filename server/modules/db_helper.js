var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');


/**
 * 统一处理数据库错误, 生产环境不应该直接返回 err 的详细内容
 * @param  {[type]} err [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.handleError = function(err, res) {
    return res.json({
        err: ERR.DB_ERROR,
        msg: '数据库错误',
        detail: err
    });

};