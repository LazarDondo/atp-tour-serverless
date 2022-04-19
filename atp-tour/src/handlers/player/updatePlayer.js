import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getPlayerById } from './getPlayer';
import validator from '@middy/validator';
import updatePlayerSchema from '../../lib/schemas/player/updatePlayerSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updatePlayer(event, context) {
    const { id } = event.pathParameters;
    const { firstName, lastName } = event.body;
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

    let updatedPlayer;

    try {
        const result = await dynamodb.update(params).promise();
        updatedPlayer = result.Attributes;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedPlayer)
    }
}

export const handler = commonMiddleware(updatePlayer)
    .use(validator({
        inputSchema: updatePlayerSchema
    }));