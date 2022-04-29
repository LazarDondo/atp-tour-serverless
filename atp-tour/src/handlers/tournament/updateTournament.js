import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getTournamentById, getTournamentByName, getTournamentByIdMySQL, getTournamentByNameMySQL } from './getTournament';
import validator from '@middy/validator';
import updateTournamentSchema from '../../lib/schemas/tournament/updateTournamentSchema';
import { prepareDates } from './validation';
import query from '../../lib/db-query';
import { update as updateTournamentSQL } from '../../lib/queries/tournament';
//const {PrismaClient} = require('@prisma/client');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//const prisma = new PrismaClient();

async function editTournament(id, name, startDate) {
    name += '-' + new Date(startDate).getFullYear();
    const tournament = await getTournamentById(id);
    if (tournament.name !== name && (await getTournamentByName(name)).length != 0) {
        throw new createError.BadRequest(`Tournament ${name} already exists`);
    }

    const completionDate = await prepareDates(startDate);

    const params = {
        TableName: process.env.TOURNAMENT_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #name = :name, startDate = :startDate, completionDate = :completionDate',
        ExpressionAttributeValues: {
            ':name': name,
            ':startDate': startDate,
            ':completionDate': completionDate.toISOString().split('T')[0]
        },
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ReturnValues: 'ALL_NEW'
    }

    try {
        /*await prisma.tournament.update({
            where: {
                id
            },
            data: {
                name,
                startDate
            }
        });*/
        //await prisma.$disconnect();
        const result = await dynamodb.update(params).promise();
        return result.Attributes;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function editTournamentMySQL(id, name, startDate) {
    name += '-' + new Date(startDate).getFullYear();
    let tournament = await getTournamentByIdMySQL(id);
    if (tournament.tournament_name !== name && (await getTournamentByNameMySQL(name)).length != 0) {
        throw new createError.BadRequest(`Tournament ${name} already exists`);
    }
    const completionDate = await prepareDates(startDate);
    const updatedTournament = [
        name,
        startDate,
        completionDate,
        id
    ];

    try {
        await query(updateTournamentSQL, updatedTournament);
        tournament.name = name;
        tournament.startDate = startDate;
        tournament.completionDate = completionDate;
        return tournament;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function updateTournament(event, context) {
    const { id } = event.pathParameters;
    const { name, startDate } = event.body;
    const updatedTournament = await editTournamentMySQL(id, name, startDate);
    return {
        statusCode: 200,
        body: JSON.stringify(updatedTournament)
    }
}

export const handler = commonMiddleware(updateTournament)
    .use(validator({
        inputSchema: updateTournamentSchema
    }));