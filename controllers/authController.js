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
const sqlQueries = require("../utils/sqlQueries");

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
        
        await sql.query(sqlQueries.createUserTable() );
        let result = await sql.query(`SELECT * FROM users WHERE email = "${email}"`);
        if(result.length>0){
            return res.status(422).json(
                errorMessage("Email already exists!")
            );
        }
        result = await sql.query(sqlQueries.insertUser(user));
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
        let result = await sql.query(`SELECT * FROM users WHERE email = "${email}"`);
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
        result = await sql.query(sqlQueries.updateUserPassword(hashedPassword,email));
        return res.json(successMessage({ "message": "Password Reset Successful" }));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

