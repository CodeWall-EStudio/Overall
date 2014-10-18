var db = require('../modules/db');

var ERR = require('../errorcode');
var Logger = require('../logger');
var config = require('../config');
var Util = require('../util');

var XLS = require('xlsjs');

exports.import = function(req, res){
    debugger
    var workbook = XLS.readFile('./' + req.files.thumbnail.path);
    var data = XLS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    
};