module.exports = {

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