import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import { getTournamentById } from './getTournament';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteTournament(event, context){
    const {id} = event.pathParameters;
    await getTournamentById(id);

    const params = {
        TableName: process.env.TOURNAMENT_TABLE_NAME,
        Key: {id}
    };

    try{
        await dynamodb.delete(params).promise();
        return {
            statusCode: 200,
            body: 'Tournament deleted successfully'
        }
    }
    catch(error){
        throw new createError.InternalServerError(error);
    }
}

export const handler = commonMiddleware(deleteTournament);