"use strict"

const Pet = require("../model/Pet");
const { insertAddress } = require("./addressController");
const {query} = require('../db');
const { successMessage, errorMessage } = require("../utils/responseUtils");

const createPet = async(req, res) => {
    try {
        const { userId, petName, breed, age, photos, category, petStatus,
        addressLine, city, state, pincode, coordinates } = req.body;
        const addressId = await insertAddress(addressLine, city, state, pincode, coordinates);
        //console.log({addressId})
       const createPetTableQuery = `CREATE TABLE IF NOT EXISTS pets(
       petId int(11) PRIMARY KEY AUTO_INCREMENT,
       userId int(11),
       addressId int(11),
       FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
       FOREIGN KEY (addressId) REFERENCES address(addressId) ON DELETE CASCADE,
       petName varchar(25),
       breed varchar(25),
       age int(8),
       photos varchar(255),
       category varchar(25),
       petStatus varchar(10),
       createdAt varchar(100)
       );
       `
     const newPost = new Pet(userId, petName, breed, age, addressId, photos, category, petStatus, new Date()) ;
      const createPostQuery = `
      INSERT INTO pets VALUES (NULL, ${newPost.toString()});
      `
       await query(createPetTableQuery);
       var result = await query(createPostQuery);
       if(result){
           const previousPetIdsQuery = `SELECT uploadPetsId from users where userId="${userId}";`
            const petIdsRes = await query(previousPetIdsQuery);
          
            const petIds = petIdsRes[0].uploadPetsId ?  [petIdsRes[0].uploadPetsId,result.insertId] : [result.insertId];
           // console.log(petIds)
            const updateUserQuery = `UPDATE users SET uploadPetsId="${petIds}" where userId="${userId}";`
            await query(updateUserQuery);    
           return res.json(successMessage(
                result
           ))
       }
    } catch (error) {
        return res.status(400).json(
            errorMessage(error.message)
        );
    }
}

const getAllPets = async(req, res) => {
    try {
        const adoptTypeQuery = `
        SELECT * FROM pets;
        `
        const result = await query(adoptTypeQuery)
        return res.json(successMessage(
            result
       ))
    } catch (error) {
        return res.status(400).send(error.message);
    }
}


module.exports = {
    createPet,
    getAllPets
}