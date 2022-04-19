import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTournaments(event, context){
    let tournaments;
    
    try{
        const result = await dynamodb.scan({
            TableName: process.env.TOURNAMENT_TABLE_NAME
        }).promise();
        tournaments = result.Items;
    }
    catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(tournaments)
    }
}

export const handler = commonMiddleware(getTournaments);