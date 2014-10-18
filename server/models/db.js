var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('../config');
var Util = require('../util');
var Logger = require('../logger');


// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
var dbUri = config.DB_URI;

mongoose.connect(dbUri, function(err, res) {
    if (err) {
        Logger.error('ERROR connecting to: ' + dbUri + '. ' + err);
    } else {
        Logger.info('Succeeded connected to: ' + dbUri);
    }
});


//
// Schemas definitions
//
var models = {
    Teachers: {
        id: String,
        nick: String,
        status: Number,
        role: Number
    }
};

for (var i in models) {
    exports[i] = mongoose.model(i, new Schema(models[i]), i);
}
