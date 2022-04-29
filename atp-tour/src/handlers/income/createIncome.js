import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import query from '../../lib/db-query';
import {create as createIncomeSQL} from '../../lib/queries/income';


const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function createIncomes(tournamentId, participants) {
    let income;
    for (const participant of participants) {
        income = {
            id: uuid(),
            tournamentId: tournamentId,
            playerId: participant.id,
            points: 0
        };
        saveIncome(income);
    }
}

export async function createIncomesMySQL(tournamentId, participants) {
    let tournamentIncomes = [];
    let income;
    for (const participant of participants) {
        income = [tournamentId, participant.id, 0];
        tournamentIncomes.push(income); 
    }
    await query(createIncomeSQL, [tournamentIncomes]);
}

function saveIncome(income) {
    try {
        dynamodb.put({
            TableName: process.env.INCOME_TABLE_NAME,
            Item: income
        }).promise();
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}