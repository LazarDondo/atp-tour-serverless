export const create = 'INSERT INTO Tournament (tournament_name, start_date, completion_date, host_country_id, tournament_type) VALUES ?;';
export const get = 'SELECT * FROM Tournament WHERE id = ?;';
export const getByName = 'SELECT * FROM Tournament WHERE tournament_name = ?;';
export const getAll = 'SELECT * FROM Tournament;';
export const update = 'UPDATE Tournament SET tournament_name = ?, start_date = ?, completion_date = ? WHERE id = ?;';
export const deleteQuery = 'DELETE FROM Tournament WHERE id = ?;';
