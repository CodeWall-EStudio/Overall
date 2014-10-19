var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


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
    // 用户和教师
    Teachers: {
        id: String,
        nick: String,
        status: Number,
        role: Number
    },
    // 指标组
    IndicatorGroups: {
        name: String,
        order: {
            type: Number,
            unique: true
        },
        weight: Number,
        score: Number,
        indicators: [{ // 指标
            name: String,
            order: Number,
            score: Number,
            gatherType: Number,
            desc: String
        }]
    },
    // // 指标
    // Indicators: {
    //     indicatorGroupId: Schema.Types.ObjectId,
    //     name: String,
    //     order: Number,
    //     score: Number,
    //     gatherType: Number,
    //     desc: String
    // }
    
    // 指标打分结果
    IndicatorScores: {
        uid: String,
        uname: String,
        scores: [Number],
        totalScore: Number
    }
};

for (var i in models) {
    exports[i] = mongoose.model(i, new Schema(models[i]), i);
}