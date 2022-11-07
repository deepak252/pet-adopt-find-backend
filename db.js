const mysql = require('mysql');
const config = require('./config/config');

const connection = mysql.createConnection(config)
connection.connect(function(err){
    if(err)
      console.log("error occured while connecting", err);
    else
      console.log("connection created with mysql successfully");
});

module.exports = connection;