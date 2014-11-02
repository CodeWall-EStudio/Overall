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
    // 系统的用户, 用于登录和权限管理
    Users: {
        id: String,
        name: String,
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
        term: ObjectId, // 所属学年
        id: String, // cmis_id
        name: String,
        grade: Number, // 年级
        'class': Number // 班级
    },

    // 教师
    Teachers: {
        term: ObjectId, // 所属学年
        id: String,
        name: String,
        classes: [{ // 教师所属的班级
            grade: Number, // 年级
            'class': Number // 班级
        }]
    },
    // 教师分组
    TeacherGroups: {
        term: ObjectId, // 所属学年
        id: Number, // 分组代码
        name: String,
        teachers: [{
            id: String,
            name: String
        }]
    },

    // 指标组
    IndicatorGroups: {
        term: ObjectId, // 所属学年
        name: String,
        order: Number,
        weight: Number,
        score: Number,
        indicators: [{ // 指标
            name: String,
            order: Number,
            score: Number,
            gatherType: Number, // 1: 文件导入, 2: 互评平均分, 3: 生评平均分
            desc: String
        }]
    },
    // // 指标
    // Indicators: {
    //     indicatorGroupId: ObjectId,
    //     name: String,
    //     order: Number,
    //     score: Number,
    //     gatherType: Number, // 1: 文件导入, 2: 互评平均分, 3: 生评平均分
    //     desc: String
    // }

    // 导入的指标打分结果
    IndicatorScores: {
        term: ObjectId, // 所属学年
        teacherId: String,
        teacherName: String,
        indicatorGroup: ObjectId, // 所属指标组
        scores: {}, // 指标得分
        // indicator: {
        //     indicator: ObjectId, // 指标
        //     score: Number // 指标得分
        // }, // 分数数组
        totalScore: Number
    },

    // 评价问卷
    Questionnaires: {
        term: ObjectId, // 所属学年
        name: String,
        order: Number,
        questions: [{ // 问卷的问题列表
            order: Number,
            name: String,
            score: Number,
            desc: String
        }]
    },

    // 互评关系
    RelationShips: {
        term: ObjectId, // 所属学年
        id: String,
        name: String,
        student: Number,
        teachers: [{
            id: String,
            name: String,
            value: Number
        }]
    },

    // 互评/生评问卷的得分记录
    EOIndicateScores: {
        term: ObjectId, // 所属学年
        type: Number, // 0: 互评, 1: 生评
        appraiseeId: String, // 被评价者的id
        appraiserId: String, // 评价者的 id
        scores: {}, // 互评生评的打分
        // question: {
        //     question: ObjectId,
        //     score: Number
        // },
        totalScore: Number,
        questionnaire: ObjectId
    },

    // 单个教师的互评/生评的平均分, 用于加速报表生成
    EOIndicateAverageScores: {
        term: ObjectId, // 所属学年
        type: Number, // 0: 互评, 1: 生评
        appraiseeId: String, // 被评价者的id,
        appraiserCount: Number, // 进行评价的人数
        totalScore: Number, // 总分
        averageScore: Number, // 平均分
        calculateTime: Date // 生成时间
    }
};

for (var i in models) {
    exports[i] = mongoose.model(i, new Schema(models[i]), i);
}