const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                }
            },
            required: ['firstName', 'lastName']
        }
    },
    required: ['body']
};

export default schema;