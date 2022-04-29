import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getPlayerById, getPlayerByIdMySQL } from './getPlayer';
import validator from '@middy/validator';
import updatePlayerSchema from '../../lib/schemas/player/updatePlayerSchema';
import query from '../../lib/db-query';
import { update as updatePlayerSQL } from '../../lib/queries/player';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function editPlayer(id, firstName, lastName) {
    await getPlayerById(id);

    const params = {
        TableName: process.env.PLAYER_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set firstName = :firstName, lastName = :lastName',
        ExpressionAttributeValues: {
            ':firstName': firstName,
            ':lastName': lastName
        },
        ReturnValues: 'ALL_NEW'
    }

    try {
        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function editPlayerMySQL(id, firstName, lastName) {
    let player = await getPlayerByIdMySQL(id);
    const updatedPlayer = [
        firstName,
        lastName,
        id
    ];

    try {
        await query(updatePlayerSQL, updatedPlayer);
        player.firstName = firstName;
        player.lastName = lastName;
        return player;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function updatePlayer(event, context) {
    const { id } = event.pathParameters;
    const { firstName, lastName } = event.body;
    const updatedPlayer = await editPlayerMySQL(id, firstName, lastName);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedPlayer)
    }
}

export const handler = commonMiddleware(updatePlayer)
    .use(validator({
        inputSchema: updatePlayerSchema
    }));