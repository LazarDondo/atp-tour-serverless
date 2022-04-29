import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import { getAll as getAllPlayersSQL } from '../../lib/queries/player';

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

async function findAllPlayersMySQL() {
    try {
        return await query(getAllPlayersSQL, []);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getPlayers(event, context) {
    const players = await findAllPlayersMySQL();
    return {
        statusCode: 200,
        body: JSON.stringify(players)
    }
}

export const handler = commonMiddleware(getPlayers);