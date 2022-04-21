import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getStatisticsById } from './getStatistics';
import validator from '@middy/validator';
import updateStatisticsSchema from '../../lib/schemas/statistics/updateStatisticsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function editStatistics(id, firstPlayerPoints, secondPlayerPoints) {
    await getStatisticsById(id);

    const params = {
        TableName: process.env.STATISTICS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set firstPlayerPoints = :firstPlayerPoints, secondPlayerPoints = :secondPlayerPoints',
        ExpressionAttributeValues: {
            ':firstPlayerPoints': firstPlayerPoints,
            ':secondPlayerPoints': secondPlayerPoints
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

async function updateStatistics(event, context) {
    const { id } = event.pathParameters;
    const { firstPlayerPoints, secondPlayerPoints } = event.body;
    const updatedStatistics = await editStatistics(id, firstPlayerPoints, secondPlayerPoints);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedStatistics)
    }
}

export const handler = commonMiddleware(updateStatistics)
    .use(validator({
        inputSchema: updateStatisticsSchema
    }));