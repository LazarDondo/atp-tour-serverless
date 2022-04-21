const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                firstPlayerPoints: {
                    type: 'number'
                },
                secondPlayerPoints: {
                    type: 'number'
                }
            },
            required: ['firstPlayerPoints', 'secondPlayerPoints']
        }
    },
    required: ['body']
};

export default schema;