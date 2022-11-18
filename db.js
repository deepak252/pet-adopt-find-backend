const mysql = require('mysql');
const util = require('util');

const { DB_PORT, DB, DB_USER, DB_PASSWORD, DB_HOST } = require('./config/key');
const  config = {
    host : DB_HOST,
    port : DB_PORT,
    database : DB,
    user : DB_USER,
    password : DB_PASSWORD
  }
const connection = mysql.createConnection(config)
connection.connect(function(err){
    if(err)
      console.log("error occured while connecting", err);
    else
      console.log("connection created with mysql successfully");
});

const query = util.promisify(connection.query).bind(connection);

module.exports = {connection,query};