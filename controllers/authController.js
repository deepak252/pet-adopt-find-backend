"use strict"

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../model/User');
const sql = require('../db');
const {
    JWT_SECRET,
} = require("../config/key");

//create table
// const createUserTable = async(req, res) => {
//     let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, fullName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), mobile int, PRIMARY KEY(id) )';

// }

const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile } = req.body;
        const hashedPassword = await bcrypt.hash(password, 13);
        // console.log({ ...req.body });
        const user = new User(fullName, email, hashedPassword, mobile);

        console.log(user);
        const createQuery = `CREATE TABLE IF NOT EXISTS 
        user (id int(11) PRIMARY KEY AUTO_INCREMENT,
        fullName varchar(30) NOT NULL,
        email varchar(20),
        password varchar(255),
        mobile varchar(15));`
        const insertQuery = `INSERT INTO user VALUES (NULL, ${user.toString()});`
        const checkEmailQuery = `SELECT email FROM user WHERE email = "${email}"`;
        let isDuplicate = false;
        sql.query(createQuery, (err, result) => {
            if (err)
                console.log(err)
        })
        sql.query(checkEmailQuery, (err, result) => {
            if (err)
                console.log(err)
            else {

                if (result.length > 0)
                    return res.status(422).json({ message: "Email already exists!!" });
                else {
                    sql.query(insertQuery, (err, result) => {
                        if (err)
                            console.log(err)
                    })
                    return res.json({ message: "Account created" });
                }
            }
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find if email is present
        const checkEmailQuery = `SELECT * FROM user WHERE email = "${email}"`;
        sql.query(checkEmailQuery, async (err, result) => {
            if (err)
                console.log(err);
            else {
                if (result.length > 0) {
                    console.log(result)
                    const doMatch = await bcrypt.compare(password, result[0].password);
                    if (doMatch) {
                        const token = jwt.sign({ _id: result[0].id }, JWT_SECRET, { expiresIn: "7d" });
                        return res.send(token);
                    } else return res.status(422).json({ error: "Invalid Email or Password!" });
                }
                else
                    res.status(422).send("email not found!!!");
            }
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    signUp,
    signIn
}