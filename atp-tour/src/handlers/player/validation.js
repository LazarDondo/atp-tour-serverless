import createError from 'http-errors';

export async function validateDateOfBirth(startDate){
    let now = new Date();
    now.setFullYear(now.getFullYear-16);
    if(new Date(startDate)>now){
        throw new createError.BadRequest('Player must be at least 16 years old!');
    }
}