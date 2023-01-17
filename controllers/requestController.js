"use strict"

const {query} = require('../db');
const Request = require('../model/Request');
const { successMessage, errorMessage } = require('../utils/responseUtils');
const SendNotification = require('../utils/fcmNotification');
const sqlQueries = require("../utils/sqlQueries");
const {petSqlObject} = require("../utils/sqlJsonObjects");
const {userById,petById} = require("../utils/misc");
const Constants = require('../config/constants');

//make a adoption request of a pet
module.exports.createRequest = async(req, res) => {
    try {
        const {message, aadharCard} = req.body;
        const newRequest = new Request(req.userId, req.params.petId, "inProgress", "pending", message, aadharCard, new Date().toISOString());
        await query(sqlQueries.createRequestTable());
        const result = await query(sqlQueries.insertRequest(newRequest));

        // Send notification to pet owner
        var pet = await petById(req.params.petId);
        SendNotification.toUserId(pet.owner.userId,{
            title : "Adopt Request Received",
            body : `${pet.owner.fullName} requested to adopt ${pet.petName}`,
            smallImage : pet.owner.profilePic ? pet.owner.profilePic  : Constants.userPic,
            bigImage : pet.photos.length>0 ? pet.photos[0] : null
        })

       return res.json(successMessage(result))
    } catch (error) {
        return res.status(400).json(errorMessage(error.message))
    }
}
//get All requests
module.exports.getAllReq = async(req, res) => {
try {
    const result = await query(sqlQueries.getAllRequests());
    return res.json(successMessage(result))
} catch (error) {
    return res.status(400).json(errorMessage(error.message))
}
}
//get All requests received to a Pet
module.exports.requestsByPetId = async(req, res) => {
    try {
        const petId = req.params.petId;
        const result = await query(sqlQueries.requestsByPetId('petId',petId));
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

//get All requests made by user
module.exports.requestsMade = async(req, res) => {
    try {
        const result = await query(sqlQueries.requestsMade( req.userId));
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

//get All requests received to user
module.exports.requestsReceived = async (req, res) => {
    try {
        const result = await query(sqlQueries.requestsReceived(req.userId));
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

//delete adoption request
module.exports.deleteAdoptionRequest = async(req, res) => {
    try {
        const result = await query(sqlQueries.deleteRequest(req.params.requestId));
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

//accepted and reject request controller
module.exports.updateStatusRequest = async(req, res) => {
    try {
        const {status} = req.body;
        const [responseId] = await query(sqlQueries.getAdoptRequest('requestId', req.params.requestId));
        if(status === 'Approved'){
            const [userRes] = await query(sqlQueries.getUser('userId', responseId.adoptReqById));
            const petIds = userRes.adoptPetsId ?  [userRes.adoptPetsId,responseId.adoptReqById] : [responseId.adoptReqById];
            const updatePetQuery = `
            update pets set petStatus = "adopted" where petId = "${responseId.petId}";
            `
            await query(sqlQueries.updateUser(`adoptPetsId="${petIds}"`, responseId.adoptReqById));
            await query(updatePetQuery);
        }
        const result = await query(sqlQueries.updateStatus(status, req.params.requestId));
        return res.json(successMessage(result));
        //adoptPetsId
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}