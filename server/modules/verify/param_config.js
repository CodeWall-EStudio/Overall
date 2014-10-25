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

    // 用户信息相关接口
    '/api/user/import': { // 导入登陆中心的用户信息, 会覆盖现有用户信息
        method: 'GET',
        params: []
    },
    '/api/user/info': { // 获取当前登陆用户的信息
        method: 'GET',
        params: []
    },
    '/api/user/search': { // 搜索用户
        method: 'GET',
        params: [{
            name: 'keyword'
        }]
    },
    '/api/user/auth': { // 对用户进行授权
        method: 'POST',
        params: [{
            name: 'id', // 用户登录用的账号
            required: true
        }, {
            name: 'role',
            type: 'number', // 1: 学生, 2(0): 教师, 4: 管理干部, 8: 学校领导, 16: 系统管理员
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
        }, {
            name: 'order'
        }]
    },
    '/api/questionnaire/detail': {
        method: 'GET',
        params: [{
            name: 'questionnaireId',
            type: 'Questionnaires'
        }, {
            name: 'order',
            type: 'number'
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
    },

    // 进行生评和互评的接口
    // 列出所有能进行评价的被评价人
    '/api/evaluation/appraisees': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'evaluationType', // 评估类型, 0: 教师互评, 1: 生评
            type: 'number'
        }]
    },
    // 进行打分
    '/api/evaluation/appraise': {
        method: 'POST',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'evaluationType', // 评估类型, 0: 教师互评, 1: 生评
            type: 'number'
        }, {
            name: 'appraiseeId', // 被评价者的id
            required: true
        }, {
            name: 'scores',
            type: 'array',
            required: true
        }, {
            name: 'questionnaire', // 问卷 id
            type: 'Questionnaires',
            required: true
        }]
    },
    // 打分结果
    '/api/evaluation/detail': {
        method: 'GET',
        params: [{
            name: 'term',
            type: 'Terms',
            required: true
        }, {
            name: 'evaluationType', // 评估类型, 0: 教师互评, 1: 生评
            type: 'number'
        }, {
            name: 'appraiseeId', // 被评价者的id
            required: true
        }]
    }
};