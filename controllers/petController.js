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

module.exports.editPet = async (req, res) => {
  try {
    const {
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
    } = req.body;
    //addressId of a pet for updation
    const getPetAddressIdQuery = `
            select addressId from pets where petId = "${req.params.petId}";
            `;
    //get addressId
    const [responseAdd] = await query(getPetAddressIdQuery);
    const updateAddressQuery = `
            update address 
            set addressLine = "${addressLine}", city = "${city}", 
            state = "${state}", pincode = "${pincode}", 
            coordinates = "${coordinates}" 
            where addressId = "${responseAdd.addressId}";
            `;
    const updatePetQuery = `
            update pets 
            set petName="${petName}", petInfo="${petInfo}", breed="${breed}", age="${age}",
            photos="${photos}", category="${category}", petStatus="${petStatus}"
            where petId="${req.params.petId}";
            `;
    const result = await query(updatePetQuery);
    await query(updateAddressQuery);
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.deletePetPost = async (req, res) => {
  try {
    const getPetAddressIdQuery = `
        select userId,addressId from pets where petId = "${req.params.petId}";
        `;
    const [responseAdd] = await query(getPetAddressIdQuery);
    const getUserQuery = `
        select uploadPetsId from users where userId = "${responseAdd.userId}";
        `;
    const [responseUser] = await query(getUserQuery);
    const newuploadPetsId = responseUser.uploadPetsId
      .split(",")
      .filter((idx) => idx != req.params.petId);

    const deletePetQuery = `
        delete from pets where petId = "${req.params.petId}";
        `;
    const deleteAddressQuery = `
         delete from address where addressId = "${responseAdd.addressId}";
        `;

    const removePetIdQuery = `
        update users set uploadPetsId="${newuploadPetsId}" where userId="${responseAdd.userId}"
        `;
    const result = await query(deletePetQuery);
    await query(deleteAddressQuery);
    await query(removePetIdQuery);
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
