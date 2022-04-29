import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import { get as getStatisticsSQL } from '../../lib/queries/statistics';

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

export async function getStatisticsByIdMySQL(id) {
    let statistics;
    try {
        statistics = await query(getStatisticsSQL, id);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (statistics.length == 0) {
        throw new createError.NotFound(`Statistics with id ${id} not found`);
    }
    return statistics[0];
}

async function getStatistics(event, context) {
    const { id } = event.pathParameters;
    const statistics = await getStatisticsByIdMySQL(id);
    return {
        statusCode: 200,
        body: JSON.stringify(statistics)
    }
}

export const handler = commonMiddleware(getStatistics);

