import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default async function getCountryById(id) {
    let country;
    try {
        const result = await dynamodb.get({
            TableName: process.env.COUNTRY_TABLE_NAME,
            Key: { id }
        }).promise();
        country = result.Item;
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!country) {
        throw new createError.NotFound(`Country with id ${id} not found`);
    }
    return country;
}

