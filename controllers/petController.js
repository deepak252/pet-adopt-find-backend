"use strict"

const Pet = require("../model/Pet");
const { insertAddress } = require("./addressController");
const {query} = require('../db');
const { successMessage, errorMessage } = require("../utils/responseUtils");

module.exports.createPet = async(req, res) => {
    try {
        const { userId, petName, petInfo, breed, age, photos, category, petStatus,
        addressLine, city, state, pincode, coordinates, gender } = req.body;
        const addressId = await insertAddress(addressLine, city, state, pincode, coordinates);
        //console.log({addressId})
       const createPetTableQuery = `CREATE TABLE IF NOT EXISTS pets(
       petId int(11) PRIMARY KEY AUTO_INCREMENT,
       userId int(11),
       addressId int(11),
       FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
       FOREIGN KEY (addressId) REFERENCES address(addressId) ON DELETE CASCADE,
       petName varchar(25), 
       petInfo varchar(255),
       breed varchar(25),
       age varchar(8),
       photos varchar(255),
       category varchar(25),
       gender varchar(10),
       petStatus varchar(10),
       createdAt varchar(100)
       );
       `
     const newPost = new Pet(userId, petName, petInfo, breed, age, addressId, photos, category, gender, petStatus, new Date()) ;
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

module.exports.getAllPets = async(req, res) => {
    try {
        const adoptTypeQuery = `
            SELECT * FROM pets
            join users  on pets.userId = users.userId
            join address on pets.addressId = address.addressId;
        `
        const result = await query(adoptTypeQuery)
        return res.json(successMessage(
            result
       ))
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports.editPet = async(req, res) => {
    try {
        const { petName, petInfo, breed, age, photos, category, petStatus,
            addressLine, city, state, pincode, coordinates } = req.body;
            //addressId of a pet for updation
            const getPetAddressIdQuery = `
            select addressId from pets where petId = "${req.params.petId}";
            `
            //get addressId
            const [responseAdd] = await query(getPetAddressIdQuery);
            const updateAddressQuery = `
            update address 
            set addressLine = "${addressLine}", city = "${city}", 
            state = "${state}", pincode = "${pincode}", 
            coordinates = "${coordinates}" 
            where addressId = "${responseAdd.addressId}";
            `
            const updatePetQuery = `
            update pets 
            set petName="${petName}", petInfo="${petInfo}", breed="${breed}", age="${age}",
            photos="${photos}", category="${category}", petStatus="${petStatus}"
            where petId="${req.params.petId}";
            `
            const result = await query(updatePetQuery);
            await query(updateAddressQuery);
            return res.json(successMessage(
                result
           ))
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports.deletePetPost = async(req, res) => {
    try {
        const getPetAddressIdQuery = `
        select userId,addressId from pets where petId = "${req.params.petId}";
        `
        const [responseAdd] = await query(getPetAddressIdQuery);
        const getUserQuery = `
        select uploadPetsId from users where userId = "${responseAdd.userId}";
        `
        const [responseUser] = await query(getUserQuery);
        const newuploadPetsId = responseUser.uploadPetsId.split(',').filter(idx => idx != req.params.petId);
        
        const deletePetQuery = `
        delete from pets where petId = "${req.params.petId}";
        `
        const deleteAddressQuery = `
         delete from address where addressId = "${responseAdd.addressId}";
        `

        const removePetIdQuery = `
        update users set uploadPetsId="${newuploadPetsId}" where userId="${responseAdd.userId}"
        `
        const result = await query(deletePetQuery);
        await query(deleteAddressQuery);
        await query(removePetIdQuery);
        return res.json(successMessage(
            result
       ))
    } catch (error) {
        return res.status(400).send(error.message);
    }
}