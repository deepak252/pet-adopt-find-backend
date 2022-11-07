"use strict"

const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../model/User');
const config = require('../config/config');
const sql = require('../db');
const db = mysql.createPool(config)


//create table
// const createUserTable = async(req, res) => {
//     let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, fullName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), mobile int, PRIMARY KEY(id) )';

// }

const registerController = async(req, res) => {
    try {
        const { fullName, email, password, mobile} = req.body;
        const hashedPassword = await bcrypt.hash(password, 13);
        // console.log({ ...req.body });
        const user = new User( fullName, email, hashedPassword, mobile);

        console.log(user);
        const createQuery = `CREATE TABLE IF NOT EXISTS 
        user (id int(11) PRIMARY KEY AUTO_INCREMENT,
        fullName varchar(30) NOT NULL,
        email varchar(20),
        password varchar(255),
        mobile varchar(15));`
        
        const insertQuery = `INSERT INTO user VALUES (NULL, ${user.toString()});`

        sql.query(createQuery, (err,result) => {
            if(err)
              console.log(err)
            else {
               console.log(result)
            }
        })
        sql.query(insertQuery, (err,result) => {
            if(err)
              console.log(err)
            else  return res.send(result);
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const signInController = async(req, res) => {
    try {
        const { email, password } = req.body;
        //find if email is present
        
        
        const hashedPassword = await bcrypt.hash(password, 13);
        const user = new User(id, fullName, email, hashedPassword, mobile);
        let pool = mysql.createPool(config);
        console.log(pool);
        console.log(user)
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    registerController,
    signInController
}