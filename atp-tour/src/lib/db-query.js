import config from '../../config/db-config.json';
const mysql = require('mysql2');

let pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

export default async function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                console.log(err);
            }
            connection.query(sql, params, (err, results) => {
                if (err) {
                    reject(err);
                }
                connection.release();
                resolve(results);
            });
        });
    });
};
