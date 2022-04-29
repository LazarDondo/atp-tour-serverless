import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import { get as getPlayerSQL } from '../../lib/queries/player';

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

export async function getPlayerByIdMySQL(id) {
    let player;
    try {
        player = await query(getPlayerSQL, id);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (player.length == 0) {
        throw new createError.NotFound(`Player with id ${id} not found`);
    }
    return player[0];
}

async function getPlayer(event, context) {
    const { id } = event.pathParameters;
    const player = await getPlayerByIdMySQL(id);
    return {
        statusCode: 200,
        body: JSON.stringify(player)
    }
}

export const handler = commonMiddleware(getPlayer);

