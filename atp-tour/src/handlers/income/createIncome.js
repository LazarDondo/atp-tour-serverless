import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';

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