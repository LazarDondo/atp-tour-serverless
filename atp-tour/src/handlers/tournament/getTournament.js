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

export async function getTournamentByName(name) {
    let tournament;
    try {
        const params = {
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            IndexName: 'nameAndStartDate',
            KeyConditionExpression: '#name = :name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            }
        }
        const result = await dynamodb.query(params).promise();
        tournament = result.Items;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
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

