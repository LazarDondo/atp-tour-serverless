import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getPlayers(event, context){
    let player;
    
    try{
        const result = await dynamodb.scan({
            TableName: process.env.PLAYER_TABLE_NAME
        }).promise();
        player = result.Items;
    }
    catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(player)
    }
}

export const handler = commonMiddleware(getPlayers);