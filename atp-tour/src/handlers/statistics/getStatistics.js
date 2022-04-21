import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getStatisticsById(id) {
    let statistics;
    try {
        const result = await dynamodb.get({
            TableName: process.env.STATISTICS_TABLE_NAME,
            Key: { id }
        }).promise();
        statistics = result.Item;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!statistics) {
        throw new createError.NotFound(`Statistics with id ${id} not found`);
    }
    return statistics;
}

async function getStatistics(event, context) {
    const { id } = event.pathParameters;
    const statistics = await getStatisticsById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(statistics)
    }
}

export const handler = commonMiddleware(getStatistics);

