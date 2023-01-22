"use strict"

const {query} = require('../db');
const Request = require('../model/Request');
const { successMessage, errorMessage } = require('../utils/responseUtils');
const SendNotification = require('../utils/fcmNotification');
const sqlQueries = require("../utils/sqlQueries");
const {petSqlObject} = require("../utils/sqlJsonObjects");
const {userById,petById, getReqById} = require("../utils/misc");
const Constants = require('../config/constants');

//make a adoption request of a pet
module.exports.createRequest = async(req, res) => {
    try {
        const {message, aadharCard} = req.body;
        const newRequest = new Request(req.userId, req.params.petId, "Pending", message, aadharCard, new Date().toISOString());
        await query(sqlQueries.createRequestTable());
        const result = await query(sqlQueries.insertRequest(newRequest));
        
        // Send notification to pet owner
        const requestedByUser = await userById(req.userId);
        var pet = await petById(req.params.petId);
        SendNotification.toUserId(pet.owner.userId,{
            title : "Adopt Request Received",
            body : `${requestedByUser.fullName} requested to adopt ${pet.petName}`,
            smallImage : requestedByUser.profilePic ? requestedByUser.profilePic  : Constants.userPic,
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
    await query(sqlQueries.createRequestTable());
    const result = await query(sqlQueries.getAllRequests());
    return res.json(successMessage(result))
} catch (error) {
    return res.status(400).json(errorMessage(error.message))
}
}
//get All requests received to a Pet
module.exports.requestsByPetId = async(req, res) => {
    try {
        await query(sqlQueries.createRequestTable());
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
        await query(sqlQueries.createRequestTable());
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
        await query(sqlQueries.createRequestTable());
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
        await query(sqlQueries.createRequestTable());
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
        await query(sqlQueries.createRequestTable());
        const {status} = req.body;
        const request = await getReqById(req.params.requestId);
        if(status === 'Accepted'){
            const [userRes] = await query(sqlQueries.getUserById( request.requestedBy.userId));
            const petIds = userRes.adoptPetsId ?  [userRes.adoptPetsId,request.pet.petId] : [request.pet.petId];
            const updatePetQuery = `
            update pets set petStatus = "adopted" where petId = "${request.pet.petId}";
            `
            await query(sqlQueries.updateUser(`adoptPetsId="${petIds}"`, request.requestedBy.userId));
            await query(updatePetQuery);
        }
         const result = await query(sqlQueries.updateStatus(status, req.params.requestId));
        // Send notification to pet owner
        // var pet = await getReqById(req.params.requestId);
        // console.log(pet)
        SendNotification.toUserId(request.requestedBy.userId,{
            title : `Request has been ${status}`,
            body : `${request.requestedBy.fullName} requested to adopt ${request.pet.petName}`,
            smallImage : request.requestedBy.profilePic ? request.requestedBy.profilePic  : Constants.userPic,
            bigImage : request.pet.photos.length>0 ? request.pet.photos[0] : null
        })
        return res.json(successMessage(result));
        //adoptPetsId
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}