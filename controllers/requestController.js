"use strict"

const {query} = require('../db');
const Request = require('../model/Request');
const { successMessage, errorMessage } = require('../utils/responseUtils');

module.exports.adoptRequest = async(req, res) => {
    try {
        const { adoptReqById, adoptReqToId } = req.body;
        const createReqTableQuery = `
        CREATE TABLE IF NOT EXISTS requests(
            requestId int(11) PRIMARY KEY AUTO_INCREMENT,
            adoptReqById int(11),
            FOREIGN KEY (adoptReqById) REFERENCES users(userId) ON DELETE CASCADE,
            adoptReqToId int(11),
            FOREIGN KEY (adoptReqToId) REFERENCES users(userId) ON DELETE CASCADE,
            petId int(11),
            FOREIGN KEY (petId) REFERENCES pets(petId) ON  DELETE CASCADE,
            requestedAt varchar(100)
        );
        `
        const newRequest = new Request(adoptReqById, adoptReqToId, req.params.petId, new Date());
        const insertRequestQuery = `
         INSERT INTO requests VALUES (NULL, ${newRequest.toString()});
        `
        await query(createReqTableQuery);
        const result = await query(insertRequestQuery);
       return res.json(successMessage(result))
    } catch (error) {
        return res.status(400).json(errorMessage(error.message))
    }
}