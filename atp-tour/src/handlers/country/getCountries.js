import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function findAllCountries(){    
    try{
        const result = await dynamodb.scan({
            TableName: process.env.COUNTRY_TABLE_NAME
        }).promise();
        return result.Items;
    }
    catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getCountries(event, context){
    const countries = await findAllCountries();
    return {
        statusCode: 200,
        body: JSON.stringify(countries)
    }
}

export const handler = commonMiddleware(getCountries);