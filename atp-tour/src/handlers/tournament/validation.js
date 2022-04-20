import createError from 'http-errors';

export async function prepareDates(startDate) {
    if (new Date(startDate) <= new Date()) {
        throw new createError.BadRequest('You must choose future date for the beggining of the tournament!');
    }

    let completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + 7);
    return completionDate;
}