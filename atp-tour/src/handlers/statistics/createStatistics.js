import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import createStatisticsSchema from '../../lib/schemas/statistics/createStatisticsSchema';
import query from '../../lib/db-query';
import { create as createStatisticsSQL } from '../../lib/queries/statistics';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addStatistics(tournamentId, firstPlayerId, secondPlayerId, firstPlayerPoints, secondPlayerPoints) {

    const statistics = {
        id: uuid(),
        tournamentId,
        firstPlayerId,
        secondPlayerId,
        firstPlayerPoints,
        secondPlayerPoints
    }

    try {
        await dynamodb.put({
            TableName: process.env.STATISTICS_TABLE_NAME,
            Item: statistics
        }).promise();
        return statistics;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function addStatisticsMySQL(tournamentId, firstPlayerId, secondPlayerId, firstPlayerPoints, secondPlayerPoints) {
    const statistics = [
        [
            tournamentId,
            firstPlayerId,
            secondPlayerId,
            firstPlayerPoints,
            secondPlayerPoints
        ]
    ];

    try {
        await query(createStatisticsSQL, [statistics]);
        return statistics;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function createStatistics(event, context) {
    const { tournamentId, firstPlayerId, secondPlayerId, firstPlayerPoints, secondPlayerPoints } = event.body;
    const statistics = await addStatisticsMySQL(tournamentId, firstPlayerId, secondPlayerId, firstPlayerPoints, secondPlayerPoints);
    return {
        statusCode: 201,
        body: JSON.stringify(statistics),
    };
}

export const handler = commonMiddleware(createStatistics)
    .use(validator({
        inputSchema: createStatisticsSchema
    }));