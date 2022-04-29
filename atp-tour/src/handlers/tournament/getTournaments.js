import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import {getAll as getAllTournamentsSQL} from '../../lib/queries/tournament';
//const {PrismaClient} = require('@prisma/client');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//const prisma = new PrismaClient();

async function findAllTournaments() {
    try {
        //await prisma.user.findMany();
        //await prisma.$disconnect();
        const result = await dynamodb.scan({
            TableName: process.env.TOURNAMENT_TABLE_NAME
        }).promise();
        return result.Items;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function findAllTournamentsMySQL() {
    try {
        return await query(getAllTournamentsSQL,[]);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getTournaments(event, context) {
    const tournaments = await findAllTournamentsMySQL();
    return {
        statusCode: 200,
        body: JSON.stringify(tournaments)
    }
}

export const handler = commonMiddleware(getTournaments);