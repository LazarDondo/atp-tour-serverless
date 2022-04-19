const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                startDate: {
                    type: 'string',
                    format: 'date'
                }
            },
            required: ['name', 'startDate']
        }
    },
    required: ['body']
};

export default schema;