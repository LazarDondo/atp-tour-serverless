import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import query from '../../lib/db-query';
import {getAll as getCountriesSQL} from '../../lib/queries/country';



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

async function findAllCountriesMySQL(){
    try{
        const results = await query(getCountriesSQL,[]);
        return results;
    }
    catch(error){
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

async function getCountries(event, context){
    const countries = await findAllCountriesMySQL();
    return {
        statusCode: 200,
        body: JSON.stringify(countries)
    }
}

export const handler = commonMiddleware(getCountries);