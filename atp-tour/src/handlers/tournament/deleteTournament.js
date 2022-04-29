import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getTournamentById, getTournamentByIdMySQL } from './getTournament';
import query from '../../lib/db-query';
import { deleteQuery as deleteTournamentSQL } from '../../lib/queries/tournament';
//const {PrismaClient} = require('@prisma/client');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//const prisma = new PrismaClient();

async function removeTournament(id) {
    await getTournamentById(id);

    const params = {
        TableName: process.env.TOURNAMENT_TABLE_NAME,
        Key: { id }
    };

    try {
        /*await prisma.tournament.delete({
            where: {
                id
            }
        });*/
        //await prisma.$disconnect();
        await dynamodb.delete(params).promise();
    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }
}

async function removeTournamentMySQL(id) {
    await getTournamentByIdMySQL(id);

    try {
        await query(deleteTournamentSQL, id);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function deleteTournament(event, context) {
    const { id } = event.pathParameters;
    await removeTournamentMySQL(id);
    return {
        statusCode: 200,
        body: 'Tournament deleted successfully'
    }
}

export const handler = commonMiddleware(deleteTournament);