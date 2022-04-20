import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config({ path: './.env' });

const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB
} = process.env;

const connect = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB
});

connect.getConnection(function(err) {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to DB");
    }
});

export default connect;