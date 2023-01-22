"use strict";

const Pet = require("../model/Pet");
const { insertAddress } = require("./addressController");
const { query } = require("../db");
const { successMessage, errorMessage } = require("../utils/responseUtils");
const sqlQueries = require("../utils/sqlQueries");
const { userById, getDistanceFromLatLonInKm } = require("../utils/misc");
const SendNotification = require("../utils/fcmNotification");
const Constants = require("../config/constants");
module.exports.createPet = async (req, res) => {
  try {
    const {
      userId,
      petName,
      petInfo,
      breed,
      age,
      photos,
      category,
      petStatus,
      addressLine,
      city,
      state,
      country,
      pincode,
      longitude,
      latitude,
      gender,
    } = req.body;
    const addressId = await insertAddress(
      addressLine,
      city,
      state,
      country,
      pincode,
      longitude,
      latitude
    );
    //console.log({addressId})

    const newPost = new Pet(
      userId,
      petName,
      petInfo,
      breed,
      age,
      addressId,
      photos,
      category,
      gender,
      petStatus,
      new Date().toISOString()
    );
    await query(sqlQueries.createPetTable());
    var result = await query(sqlQueries.insertPet(newPost));
    if (result) {
      const petIdsRes = await query(sqlQueries.getUserById( userId));

      const petIds = petIdsRes[0].uploadPetsId
        ? [petIdsRes[0].uploadPetsId, result.insertId]
        : [result.insertId];

      await query(sqlQueries.updateUser(`uploadPetsId="${petIds}"`, userId));
      const userDet = await userById(userId);
      if(petStatus === "missing" && userDet.address){
        const lat1 = userDet.address.latitude;
        const long1 = userDet.address.longitude;
        const users = await query(sqlQueries.getAllUsers());
        let nearByUsers = [];
         nearByUsers = users.map(user => {
           return {
             user : user,
             distance : getDistanceFromLatLonInKm(lat1, long1, user.latitude, user.longitude)
           }
         })
        nearByUsers.sort((a,b) => a.distance - b.distance);
        console.log(nearByUsers)
        nearByUsers.map(async(nearUser) => {
          SendNotification.toUserId(nearUser.userId, {
            title : `${petName} is missing in your area`,
            body : `${userDet.fullName} has lost its pets ${petName}. If you see this pet please inform.`,
            smallImage : userDet.profilePic ? userDet.profilePic  : Constants.userPic,
            bigImage : photos.length>0 ? photos[0] : null
          })
        })
        
       }
      return res.json(successMessage(result));
    }
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.getAllPets = async (req, res) => {
  try {
    await query(sqlQueries.createPetTable());
    const result = await query(sqlQueries.getAllPets());
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.getPetsByStatus = async(req, res) => {
    try {
      //  if(req.query.status !== 'abandoned' || req.query.status !== 'adopt' || req.query.status !== 'missing')
        await query(sqlQueries.createPetTable());
        const result = await query(sqlQueries.getPetsByStatus(req.query.status));
        const userDet = await userById(req.userId);
        if(req.query.status === "missing" && userDet.address){
         const lat1 = userDet.address.latitude;
         const long1 = userDet.address.longitude;
         let nearByMissingPets = [];
          nearByMissingPets = result.map(missPet => {
            return {
              pet : missPet,
              distance : getDistanceFromLatLonInKm(lat1, long1, missPet.latitude, missPet.longitude)
            }
          })
         nearByMissingPets.sort((a,b) => a.distance - b.distance);
         return res.json(successMessage(nearByMissingPets));
        }
        
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports.getUploadedPetsByUser = async(req, res) => {
    try {
      await query(sqlQueries.createPetTable());
        const [resultUser] = await query(sqlQueries.getUserById( req.userId));
        const arr = resultUser?.uploadPetsId?.split(",");
         const result = arr ? await query(sqlQueries.getPets(arr)) : null;
         return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports.getPetById = async(req, res) => {
  try {
    await query(sqlQueries.createPetTable());
    const result = await query(sqlQueries.getPets([req.params.petId]));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(errorMessage);
  }
}

module.exports.editPet = async (req, res) => {
  try {
    const {
      petId,
      petName,
      petInfo,
      breed,
      age,
      photos,
      category,
      gender,
      petStatus,
      addressLine,
      city,
      state,
      country,
      pincode,
      longitude,
      latitude
    } = req.body;

    await query(sqlQueries.createPetTable());
    //get addressId
    const [responsePet] = await query(sqlQueries.getPets(petId));
    await query(sqlQueries.editPetDetails(petName,petInfo,breed,age,photos,category,gender,petStatus,petId));
    await query(sqlQueries.editAddress(addressLine,city,state,country,pincode,longitude, latitude,responsePet.addressId));
    const result = await query(sqlQueries.getPets([petId]));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.deletePetPost = async (req, res) => {
  try {
    const [responsePet] = await query(sqlQueries.getPets(req.params.petId));
    const [responseUser] = await query(sqlQueries.getUserById( responsePet.userId));
    const newuploadPetsId = responseUser.uploadPetsId
      .split(",")
      .filter((idx) => idx != req.params.petId);

    const updatedCol = `uploadPetsId="${newuploadPetsId}"`;
    const result = await query(sqlQueries.deletePet(req.params.petId));
    await query(sqlQueries.deleteAddress(responsePet.addressId));
    await query(sqlQueries.updateUser(updatedCol, responsePet.userId));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

