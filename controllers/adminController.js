"use strict"

const User = require('../model/User');
const sql = require('../db');

const { errorMessage, successMessage } = require("../utils/responseUtils");

module.exports.allUsers = async(req,res)=>{
    try {
        let result = await sql.query(`
            select * from users
        `)
        return res.json(successMessage(result));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}


module.exports.getUserById = async (req, res) => {
    try {
        let result = await sql.query(`
            select * from users 
            where userId="${req.params.id}"
        `)
        if (result.length == 0) {
            return res.status(404).json(
                errorMessage("User not found!")
            );
        }
        return res.json(successMessage(result[0]));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}


