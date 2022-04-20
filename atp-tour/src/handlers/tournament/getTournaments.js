import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function findAllTournaments() {
    try {
        const result = await dynamodb.scan({
            TableName: process.env.TOURNAMENT_TABLE_NAME
        }).promise();
        return result.Items;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getTournaments(event, context) {
    const tournaments = await findAllTournaments();
    return {
        statusCode: 200,
        body: JSON.stringify(tournaments)
    }
}

export const handler = commonMiddleware(getTournaments);