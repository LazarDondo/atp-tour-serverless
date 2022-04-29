import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import createTournamentSchema from '../../lib/schemas/tournament/createTournamentSchema';
import getCountryById from '../country/getCountry';
import { getTournamentByName, getTournamentByNameMySQL } from './getTournament';
import { prepareDates } from './validation';
import { createMatches, createMatchesMySQL } from '../matches/createMatches';
import { createIncomes, createIncomesMySQL } from '../income/createIncome';
import query from '../../lib/db-query';
import { create as createTournamentSQL } from '../../lib/queries/tournament';
//const {PrismaClient} = require('@prisma/client');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//const prisma = new PrismaClient();

async function addTournament(name, startDate, hostCountry, tournamentType, participants) {

    await getCountryById(hostCountry);

    name += '-' + new Date(startDate).getFullYear();
    const foundTournament = await getTournamentByName(name);

    if (foundTournament.length != 0) {
        throw new createError.BadRequest(`Tournament ${name} already exists`);
    }

    const completionDate = await prepareDates(startDate);

    const tournament = {
        id: uuid(),
        name,
        startDate,
        completionDate: completionDate.toISOString().split('T')[0],
        hostCountry,
        tournamentType
    }

    try {
        //await prisma.tournament.create(tournament);
        //await prisma.$disconnect();
        await dynamodb.put({
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            Item: tournament
        }).promise();

        createMatches(tournament, participants);
        await createIncomes(tournament.id, participants);
        return tournament;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function addTournamentMySQL(name, startDate, hostCountry, tournamentType, participants) {

    name += '-' + new Date(startDate).getFullYear();
    const foundTournament = await getTournamentByNameMySQL(name);

    if (foundTournament.length != 0) {
        throw new createError.BadRequest(`Tournament ${name} already exists`);
    }

    let completionDate = await prepareDates(startDate);
    completionDate = completionDate.toISOString().split('T')[0]

    const tournament = [
        [
            name,
            startDate,
            completionDate,
            hostCountry,
            tournamentType
        ]
    ]

    try {
        const result = await query(createTournamentSQL, [tournament]);
        createMatchesMySQL(result.insertId, startDate, participants);
        await createIncomesMySQL(result.insertId, participants);
        return tournament;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function createTournament(event, context) {
    let { name, startDate, hostCountry, tournamentType, participants } = event.body;
    const tournament = await addTournamentMySQL(name, startDate, hostCountry, tournamentType, participants);
    return {
        statusCode: 201,
        body: JSON.stringify(tournament),
    };
}

export const handler = commonMiddleware(createTournament)
    .use(validator({
        inputSchema: createTournamentSchema
    }));