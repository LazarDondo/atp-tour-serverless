import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import { GRAND_SLAM_EIGHTS_FINALS } from '../../lib/model';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export function createMatches(tournament, participants) {
    if (participants.length !== 16) {
        throw new createError.InternalServerError('Tournament must have exactly 16 participants!');
    }
    let startDate = new Date(tournament.startDate);
    let match;
    console.log(1111111);
    for (let i = 0; i < participants.length / 2; i++) {
        startDate.setDate(startDate.getDate() + i % 2);
        match = {
            id: uuid(),
            tournamentId: tournament.id,
            firstPlayerId: participants[i].id,
            secondPlayerId: participants[participants.length - 1 - i].id,
            matchDate: startDate.toISOString().split('T')[0],
            roundName: GRAND_SLAM_EIGHTS_FINALS
        }
        saveMatch(match);
    }}

function saveMatch(match) {
    try {
        dynamodb.put({
            TableName: process.env.MATCH_TABLE_NAME,
            Item: match
        }).promise();
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}