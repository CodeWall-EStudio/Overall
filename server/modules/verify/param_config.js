module.exports = {
    // 学期

    '/api/term/create': {
        method: 'POST',
        params: [{
            name: 'name',
            required: true
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
        },{
            name: 'name'
        },{
            name: 'status',
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
        params: [
        
        ]
    },
    '/api/indicator/import': {
        method: 'POST',
        params: [
            {
                name: 'indicatorGroup',
                type: 'IndicatorGroups',
                required: true
            }
        ]
    },
    '/api/indicator/list': {
        method: 'GET',
        params: [
            {
                name: 'indicatorGroup',
                type: 'IndicatorGroups',
                required: true
            }
        ]
    },
    '/api/indicatorscore/import': {
        method: 'POST',
        params: [
            {
                name: 'indicatorGroup',
                type: 'IndicatorGroups',
                required: true
            }
        ]
    },
};