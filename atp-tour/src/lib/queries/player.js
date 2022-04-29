export const create = 'INSERT INTO Player (first_name, last_name, birth_country_id, date_of_birth, current_points, live_points) VALUES ?;';
export const get = 'SELECT * FROM Player WHERE id = ?;';
export const getAll = 'SELECT * FROM Player;';
export const update = 'UPDATE Player SET first_name = ?, last_name = ? WHERE id = ?;';
