const schema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                tournamentId: {
                    type: 'string'
                },
                firstPlayerId: {
                    type: 'string'
                },
                secondPlayerId: {
                    type: 'string'
                },
                firstPlayerPoints: {
                    type: 'number'
                },
                secondPlayerPoints: {
                    type: 'number'
                }
            },
            required: ['tournamentId', 'firstPlayerId', 'secondPlayerId', 'firstPlayerPoints', 'secondPlayerPoints']
        }
    },
    required: ['body']
};

export default schema;