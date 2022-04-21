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
                },
                hostCountry: {
                    type: 'number'
                },
                tournamentType: {
                    type: 'string',
                    enum: ['Grand Slam', 'Masters 1000'],
                    default: 'Grand Slam'
                },
                participants: {
                    type: 'array',
                    items: {
                        type: 'object'
                    },
                    minItems: 1,
                    uniqueItems: true,
                }
            },
            required: ['name', 'startDate', 'hostCountry', 'participants']
        }
    },
    required: ['body']
};

export default schema;