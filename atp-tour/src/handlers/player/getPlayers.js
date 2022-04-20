import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function findAllPlayers() {
    try {
        const result = await dynamodb.scan({
            TableName: process.env.PLAYER_TABLE_NAME
        }).promise();
        return result.Items;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getPlayers(event, context) {
    const players = await findAllPlayers();
    return {
        statusCode: 200,
        body: JSON.stringify(players)
    }
}

export const handler = commonMiddleware(getPlayers);