import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getTournamentById } from './getTournament';
import validator from '@middy/validator';
import updateTournamentSchema from '../../lib/schemas/tournament/updateTournamentSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateTournament(event, context) {
    const { id } = event.pathParameters;
    const { name, startDate } = event.body;
    await getTournamentById(id);

    const params = {
        TableName: process.env.TOURNAMENT_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #name = :name, startDate = :startDate',
        ExpressionAttributeValues: {
            ':name': name,
            ':startDate': startDate
        },
        ExpressionAttributeNames: {
            '#name':'name'
        },
        ReturnValues: 'ALL_NEW'
    }

    let updatedTournament;

    try {
        const result = await dynamodb.update(params).promise();
        updatedTournament = result.Attributes;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedTournament)
    }
}

export const handler = commonMiddleware(updateTournament)
.use(validator({
    inputSchema: updateTournamentSchema
}));