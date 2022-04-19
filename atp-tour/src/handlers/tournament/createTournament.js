import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import createTournamentSchema from '../../lib/schemas/tournament/createTournamentSchema';
import getCountryById from '../country/getCountry';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createTournament(event, context) {
    const { name, startDate, hostCountry, tournamentType } = event.body;

    await getCountryById(hostCountry);

    let completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + 7);

    const tournament = {
        id: uuid(),
        name,
        startDate,
        completionDate: completionDate.toISOString().split('T')[0],
        hostCountry,
        tournamentType
    }

    try {
        await dynamodb.put({
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            Item: tournament
        }).promise();
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify(tournament),
    };
}

export const handler = commonMiddleware(createTournament)
    .use(validator({
        inputSchema: createTournamentSchema
    }));