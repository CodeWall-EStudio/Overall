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
        },{
            name: 'id',
            required: true
        }]
    },

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
    '/api/indicatorscore/import': {
        method: 'POST',
        params: [{
            name: 'indicatorGroup',
            type: 'IndicatorGroups',
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
};