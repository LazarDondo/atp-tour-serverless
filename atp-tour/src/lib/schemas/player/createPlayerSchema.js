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
                },
                birthCountry: {
                    type: 'number'
                },
                dateOfBirth: {
                    type: 'string',
                    format: 'date'
                },
                currentPoints: {
                    type: 'number'
                }
            },
            required: ['firstName', 'lastName', 'birthCountry', 'dateOfBirth', 'currentPoints']
        }
    },
    required: ['body']
};

export default schema;