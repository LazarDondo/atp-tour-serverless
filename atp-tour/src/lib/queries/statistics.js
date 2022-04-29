export const create = 'INSERT INTO Statistics (tournament_id, first_player_id, second_player_id, first_player_points, second_player_points) VALUES ?;';
export const get = 'SELECT * FROM Statistics WHERE id = ?;';
export const update = 'UPDATE Statistics SET first_player_points = ?, second_player_points = ? WHERE id = ?;';
