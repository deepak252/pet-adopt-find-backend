"use strict"

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../model/User');
const sql = require('../db');
const {
    JWT_SECRET,
} = require("../config/key");
const validator = require("../utils/validator");
const { errorMessage, successMessage } = require("../utils/responseUtils");


//create table
// const createUserTable = async(req, res) => {
//     let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, fullName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), mobile int, PRIMARY KEY(id) )';

// }

module.exports.signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile } = req.body;
        if (validator.validateName(fullName)){
            return res.status(400).json(
                errorMessage(validator.validateName(fullName))
            );
        }
        if (validator.validateEmail(email)) {
            return res.status(400).json(
                errorMessage(validator.validateEmail(email))
            );
        }
        if (validator.validatePhone(mobile)) {
            return res.status(400).json(
                errorMessage(validator.validatePhone(mobile))
            );
        }
        if (validator.validatePassword(password)) {
            return res.status(400).json(
                errorMessage(validator.validatePassword(password))
            );
        }
        
        const hashedPassword = await bcrypt.hash(password, 13);
        const user = new User(fullName, email, hashedPassword, mobile);
        
        const createUserTableQuery = `CREATE TABLE IF NOT EXISTS 
            users (userId int(11) PRIMARY KEY AUTO_INCREMENT,
            fullName varchar(30) NOT NULL,
            email varchar(20),
            password varchar(255),
            mobile varchar(15),
            addressId int(11),
            profilePic varchar(255),
            adoptPetsId varchar(21),
            uploadPetsId varchar(21),
            favouritePetsId varchar(21),
            fcmId int(11)
        );`
        const insertQuery = `INSERT INTO users VALUES (NULL, ${user.toString()}, NULL, NULL, NULL, NULL, NULL, NULL);`
        const checkEmailQuery = `SELECT email FROM users WHERE email = "${email}"`;

        await sql.query(createUserTableQuery );
        let result = await sql.query(checkEmailQuery);
        if(result.length>0){
            return res.status(422).json(
                errorMessage("Email already exists!")
            );
        }
        result = await sql.query(insertQuery);
        const token = jwt.sign({ id: result.insertId }, JWT_SECRET)
        return res.json(successMessage({
            "message" : "Account Created Successfully",
            token
        }));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

module.exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find if email is present
        const checkEmailQuery = `SELECT * FROM users WHERE email = "${email}"`;
        let result = await sql.query(checkEmailQuery);
        if(result.length<=0){
            return res.status(422).json(
                errorMessage("Email not found!")
            );
        }
        // Check password
        const doMatch = await bcrypt.compare(password, result[0].password);
        if (doMatch) {
            const token = jwt.sign({ id: result[0].userId }, JWT_SECRET);
            return res.json(successMessage({ 
                "message": "Sign In Successful",
                token
            }));
        } else {
            return res.status(422).json(
                errorMessage("Invalid Email or Password!")
            );
        } 
        
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}


module.exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        //find if email is present
        let result = await sql.query(`SELECT * FROM users WHERE email = "${email}"`);
        if (result.length <= 0) {
            return res.status(422).json(
                errorMessage("Email not found!")
            );
        }
        //validate password
        if (validator.validatePassword(newPassword)) {
            return res.status(400).json(
                errorMessage(validator.validatePassword(newPassword))
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 13);
        //Update password
        result = await sql.query(`
            UPDATE users 
            set password = "${hashedPassword}"  
            WHERE email= "${email}"
        `);
        return res.json(successMessage({ "message": "Password Reset Successful" }));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

