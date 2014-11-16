var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var XLS = require('xlsjs');
var ejs = require('ejs');
var process = require('child_process');



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

exports.writeExcel = function(res, options) {
    var tmpl = path.join(__dirname, '../views/' + options.tmpl + '.html');
    var tmp = path.join(__dirname, '../../tmp/');
    if (!fs.existsSync(tmp)) {
        fs.mkdirSync(tmp);
    }
    ejs.renderFile(tmpl, options.data, function(err, str) {
        if (err) {
            res.send(err);
        } else {
            var src = tmp + options.name + '.html';
            var target = tmp + options.name + '.xls';
            fs.writeFileSync(src, str);
            var cmd = 'ssconvert ' + src + ' ' + target;
            process.exec(cmd, function(err, stdout, stderr) {
                if (err) {
                    res.send('>>>file convert error: to xls: ' + err);
                    Logger.error('>>>file convert error: to xls: ', err);
                    return;
                }
                // res.set({
                //     'Content-Type': 'application/vnd.ms-excel',
                //     'Content-Disposition': 'attachment; filename=' + encodeURI(options.name)
                // });
                res.attachment(target);
                res.sendfile(target);
            });
        }
    });
};