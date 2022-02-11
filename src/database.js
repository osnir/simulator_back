require('dotenv').config();


const database = process.env.DATA_BASE;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host     = process.env.HOST;
const dialect  = process.env.DIALECT;

/*
const database = process.env.DATA_BASE || 'sellcons_database';
const username = process.env.USER_NAME || 'sellcons_user';
const password = process.env.PASSWORD || 'l462895A@';
const host     = process.env.HOST || 'localhost';
const dialect  = process.env.DIALECT;
*/

const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: host,
    user: username,
    database: database,
    password: password
});

module.exports = connection;
