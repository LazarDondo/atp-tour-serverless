import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCountries(event, context){
    let country;
    
    try{
        const result = await dynamodb.scan({
            TableName: process.env.COUNTRY_TABLE_NAME
        }).promise();
        country = result.Items;
    }
    catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(country)
    }
}

export const handler = commonMiddleware(getCountries);