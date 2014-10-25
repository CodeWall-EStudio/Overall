var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.readExcel = function(req, res) {
    var data;
    try {
        var workbook = XLS.readFile(req.files.file.path);
        data = XLS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } catch (e) {
        res.json({
            err: ERR.IMPORT_FAILURE,
            msg: '导入失败',
            detail: e.message
        });
        return null;
    }

    if (!data.length) {
        res.json({
            err: ERR.IMPORT_FAILURE,
            msg: '没有数据要导入'
        });
        return null;
    }

    return data;

};