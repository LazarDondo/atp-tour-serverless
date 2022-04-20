import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import createPlayerSchema from '../../lib/schemas/player/createPlayerSchema';
import getCountryById from '../country/getCountry';
import {validateDateOfBirth} from './validation'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addPlayer(firstName, lastName, birthCountry, dateOfBirth, currentPoints) {
    await getCountryById(birthCountry);
    await validateDateOfBirth(dateOfBirth);

    const player = {
        id: uuid(),
        firstName,
        lastName,
        birthCountry,
        dateOfBirth,
        currentPoints,
        livePoints: currentPoints
    }

    try {
        await dynamodb.put({
            TableName: process.env.PLAYER_TABLE_NAME,
            Item: player
        }).promise();
        return player;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function createPlayer(event, context) {
    const { firstName, lastName, birthCountry, dateOfBirth, currentPoints } = event.body;
    const player = await addPlayer(firstName, lastName, birthCountry, dateOfBirth, currentPoints);
    return {
        statusCode: 201,
        body: JSON.stringify(player),
    };
}

export const handler = commonMiddleware(createPlayer)
    .use(validator({
        inputSchema: createPlayerSchema
    }));