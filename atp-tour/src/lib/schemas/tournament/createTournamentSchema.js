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
                }
            },
            required: ['name', 'startDate', 'hostCountry']
        }
    },
    required: ['body']
};

export default schema;