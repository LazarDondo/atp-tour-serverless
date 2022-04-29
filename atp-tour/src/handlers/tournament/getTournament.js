import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import {get as getTournamentSQL, getByName as getTournamentByNameSQL} from '../../lib/queries/tournament';
//const {PrismaClient} = require('@prisma/client');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//const prisma = new PrismaClient();

export async function getTournamentById(id) {
    let tournament;
    try {
        /*await prisma.tournament.findUnique({
            where: {
                id
            }
        });*/
        //await prisma.$disconnect();
        const result = await dynamodb.get({
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            Key: { id }
        }).promise();
        tournament = result.Item;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!tournament) {
        throw new createError.NotFound(`Tournament with id ${id} not found`);
    }
    return tournament;
}

export async function getTournamentByIdMySQL(id) {
    let tournament;
    try {
        tournament = await query(getTournamentSQL, id);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (tournament.length==0) {
        throw new createError.NotFound(`Tournament with id ${id} not found`);
    }
    return tournament[0];
}

export async function getTournamentByName(name) {
    let tournament;
    try {
        const params = {
            TableName: process.env.TOURNAMENT_TABLE_NAME,
            IndexName: 'nameAndStartDate',
            KeyConditionExpression: '#name = :name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            }
        }
        const result = await dynamodb.query(params).promise();
        tournament = result.Items;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    return tournament;
}

export async function getTournamentByNameMySQL(name) {
    let tournament;
    try {
        tournament = await query(getTournamentByNameSQL, name);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    return tournament;
}

async function getTournament(event, context) {
    const { id } = event.pathParameters;
    const tournament = await getTournamentByIdMySQL(id);
    return {
        statusCode: 200,
        body: JSON.stringify(tournament)
    }
}

export const handler = commonMiddleware(getTournament);

