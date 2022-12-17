"use strict"


const sql = require('../db');
const validator = require("../utils/validator");
const { errorMessage, successMessage } = require("../utils/responseUtils");

module.exports.getUser =  async(req,res)=>{
    try{
        let result = await sql.query(`
            select * from users where userId="${req.userId}"
        `)
        if(result.length==0){
            return res.status(404).json(
                errorMessage("User not found!")
            );
        }
        return res.json(successMessage(result[0]));

    }catch(error){
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

module.exports.updateUser = async(req, res) => {
    try {
        const { fullName, email, mobile } = req.body;
        let updatedCols = "";
        if (fullName) {
            if (validator.validateName(fullName)){
                return res.status(400).json(
                    errorMessage(validator.validateName(fullName))
                );
            }
            updatedCols+=` fullName = "${fullName}" `
        }
        if (email) {
            if (validator.validateEmail(email)){
                return res.status(400).json(
                    errorMessage(validator.validateEmail(email))
                );
            }
            if(updatedCols.length>0){
                updatedCols+=","
            }
            updatedCols += ` email = "${email}" `
        }
        if (mobile ) {
            if (validator.validatePhone(mobile)){
                return res.status(400).json(
                    errorMessage(validator.validatePhone(mobile))
                );
            }
            if (updatedCols.length > 0) {
                updatedCols += ","
            }
            updatedCols += ` mobile = "${mobile}" `
        }
        let result = await sql.query(`
            UPDATE users
            set ${updatedCols}
            where userId = "${req.userId}"
        `);

        result = await sql.query(`
            select * from users where userId="${req.userId}"
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

module.exports.deleteUserById = async (req, res) => {
    try {
        let result = await sql.query(`
            delete from users 
            where userId="${req.params.id}"
        `)
        return res.json(successMessage(result));

    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}