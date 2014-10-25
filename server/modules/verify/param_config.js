module.exports = {

    // 登录接口
    '/api/login/': { //
        method: 'GET',
        params: []
    },
    '/api/login/student': { // 学生登录
        method: 'POST',
        params: [{
            name: 'name',
            required: true
        }, {
            name: 'id',
            required: true
        }]
    },

    // 学期
    '/api/term/create': {
        method: 'POST',
        params: [{
            name: 'name',
            required: true
        }, {
            name: 'order',
            type: 'number'
        }]
    },

    '/api/term/list': {
        method: 'GET',
        params: []
    },

    '/api/term/modify': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'name'
        }, {
            name: 'status',
            type: 'number'
        }, {
            name: 'order',
            type: 'number'
        }]
    },

    '/api/term/delete': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },

    // 指标组
    '/api/indicatorgroup/create': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'name',
            required: true
        }, {
            name: 'order',
            type: 'number',
            required: true
        }, {
            name: 'weight',
            type: 'number',
            required: true
        }, {
            name: 'score',
            type: 'number',
            required: true
        }]
    },
    '/api/indicatorgroup/list': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },

    // 指标接口
    '/api/indicator/import': {
        method: 'POST',
        params: [{
            name: 'indicatorGroup',
            type: 'IndicatorGroups',
            required: true
        }]
    },
    '/api/indicator/list': {
        method: 'GET',
        params: [{
            name: 'indicatorGroup',
            type: 'IndicatorGroups',
            required: true
        }]
    },

    // 指标评分
    '/api/indicatorscore/import': {
        method: 'POST',
        params: [{
            name: 'indicatorGroup',
            type: 'IndicatorGroups',
            required: true
        }]
    },
    '/api/indicatorscore/report': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'teacherGroup',
            type: 'TeacherGroups'
        }, {
            name: 'indicatorGroup',
            type: 'IndicatorGroups'
        }, {
            name: 'teacherName',
            type: 'string'
        }]
    },
    '/api/indicatorscore/detail': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'teacherGroup',
            type: 'TeacherGroups',
            required: true
        }, {
            name: 'teacherId',
            type: 'string',
            required: true
        }, {
            name: 'type', // 报表类型, 1: 评价报告, 2: 互评明细, 3: 生评明细
            type: 'number',
            required: true
        }]
    },

    // 学生的接口
    '/api/student/import': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },
    '/api/student/list': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'grade',
        }, {
            name: 'cls'
        }]
    },
    // 教师接口
    '/api/teacher/import': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },

    '/api/teachergroup/import': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },

    '/api/teachergroup/list': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },

    // 问卷接口
    '/api/questionnaire/import': {
        method: 'POST',
        params: [{
            name: 'questionnaire',
            type: 'Questionnaires',
            required: true
        }]
    },

    '/api/questionnaire/create': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'name',
            required: true
        }, {
            name: 'order',
            type: 'number',
            required: true
        }]
    },
    '/api/questionnaire/list': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },
    '/api/questionnaire/detail': {
        method: 'GET',
        params: [{
            name: 'questionnaireId',
            type: 'Questionnaires',
            required: true
        }]
    },

    // 互评关系导入
    '/api/relationship/import': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    },
    '/api/relationship/list': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }]
    }    

};