import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getPlayerById(id) {
    let player;
    try {
        const result = await dynamodb.get({
            TableName: process.env.PLAYER_TABLE_NAME,
            Key: { id }
        }).promise();
        player = result.Item;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!player) {
        throw new createError.NotFound(`Player with id ${id} not found`);
    }
    return player;
}

async function getPlayer(event, context) {
    const { id } = event.pathParameters;
    const player = await getPlayerById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(player)
    }
}

export const handler = commonMiddleware(getPlayer);

