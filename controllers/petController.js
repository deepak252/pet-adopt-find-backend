"use strict";

const Pet = require("../model/Pet");
const { insertAddress } = require("./addressController");
const { query } = require("../db");
const { successMessage, errorMessage } = require("../utils/responseUtils");
const sqlQueries = require("../utils/sqlQueries");
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
      pincode,
      coordinates,
      gender,
    } = req.body;
    const addressId = await insertAddress(
      addressLine,
      city,
      state,
      pincode,
      coordinates
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
      new Date()
    );
    await query(sqlQueries.createPetTable());
    var result = await query(sqlQueries.insertPet(newPost));
    if (result) {
      const petIdsRes = await query(sqlQueries.getUser("userId", userId));

      const petIds = petIdsRes[0].uploadPetsId
        ? [petIdsRes[0].uploadPetsId, result.insertId]
        : [result.insertId];

      await query(sqlQueries.updateUser(`uploadPetsId="${petIds}"`, userId));
      return res.json(successMessage(result));
    }
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.getAllPets = async (req, res) => {
  try {
    const result = await query(sqlQueries.getAllPets());
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.getPetsByStatus = async(req, res) => {
    try {
      //  if(req.query.status !== 'abandoned' || req.query.status !== 'adopt' || req.query.status !== 'missing')
             
        const result = await query(sqlQueries.getPetsByStatus(req.query.status));
        return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports.getUploadedPetsByUser = async(req, res) => {
    try {
        const [resultUser] = await query(sqlQueries.getUser('userId', req.userId));
        const arr = resultUser?.uploadPetsId?.split(",");
         const result = arr ? await query(sqlQueries.getPets(arr)) : null;
         return res.json(successMessage(result));
    } catch (error) {
        return res.status(400).send(error.message);
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
      pincode,
      coordinates,
    } = req.body;

    //get addressId
    const [responsePet] = await query(sqlQueries.getPets(petId));
    const result = await query(sqlQueries.editPetDetails(petName,petInfo,breed,age,photos,category,gender,petStatus,petId));
    await query(sqlQueries.editAddress(addressLine,city,state,pincode,coordinates,responsePet.addressId));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.deletePetPost = async (req, res) => {
  try {
    const [responsePet] = await query(sqlQueries.getPets(req.params.petId));
    const [responseUser] = await query(sqlQueries.getUser('userId', responsePet.userId));
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

