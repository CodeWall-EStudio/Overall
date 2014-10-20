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

    // 学期
    Terms: {
        name: String,
        order: Number, // 排序用
        status: Number //0: 未激活, 1: 激活, 2: 关闭, 4: 评价完成
    },

    // 学生, 学生会跟学期关联
    Students: {
        term: ObjectId,
        id: String, // cmis_id
        name: String,
        grade: Number, // 年级
        'class': Number // 班级
    },

    // 指标组
    IndicatorGroups: {
        term: ObjectId,
        name: String,
        order: Number,
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
        term: ObjectId, // 所属学年
        indicatorGroup: ObjectId, // 所属指标组
        scores: [Number],
        totalScore: Number
    }
};

for (var i in models) {
    exports[i] = mongoose.model(i, new Schema(models[i]), i);
}