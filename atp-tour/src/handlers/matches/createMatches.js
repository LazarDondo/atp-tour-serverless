import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import { GRAND_SLAM_EIGHTS_FINALS } from '../../lib/model';
import query from '../../lib/db-query';
import { create as createMatchSQL } from '../../lib/queries/match';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export function createMatches(tournament, participants) {
    if (participants.length !== 16) {
        throw new createError.InternalServerError('Tournament must have exactly 16 participants!');
    }
    let startDate = new Date(tournament.startDate);
    let match;
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
    }
}

export function createMatchesMySQL(id, startDate, participants) {
    if (participants.length !== 16) {
        throw new createError.InternalServerError('Tournament must have exactly 16 participants!');
    }
    startDate = new Date(startDate);
    let match;
    let matches = [];
    for (let i = 0; i < participants.length / 2; i++) {
        startDate.setDate(startDate.getDate() + i % 2);
        match = [
            id,
            participants[i].id,
            participants[participants.length - 1 - i].id,
            startDate.toISOString().split('T')[0],
            GRAND_SLAM_EIGHTS_FINALS
        ];
        matches.push(match)
    }
    query(createMatchSQL, [matches]);
}

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