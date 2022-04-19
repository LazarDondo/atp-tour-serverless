import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getTournamentById(id) {
    let tournament;
    try {
        const result = await dynamodb.get({
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            Key: { id }
        }).promise();
        tournament = result.Item;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!tournament) {
        throw new createError.NotFound(`Tournament with id ${id} not found`);
    }
    return tournament;
}

async function getTournament(event, context) {
    const { id } = event.pathParameters;
    const tournament = await getTournamentById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(tournament)
    }
}

export const handler = commonMiddleware(getTournament);

