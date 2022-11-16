"use strict"

const Pet = require("../model/Pet");
const inputAddress = require("./addressController");
const sql = require('../db');
const createPost = async(req, res) => {
    try {
        const { userId, petName, breed, age, photos, category, petStatus,
        addressLine, city, state, pincode, coordinates } = req.body;
       const addressId = await inputAddress(addressLine, city, state, pincode, coordinates);
        console.log(addressId)
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
       createdAt varchar(20)
       );
       `
     const newPost = new Pet(userId, petName, breed, age, "1", photos, category, petStatus, new Date()) ;
      const createPostQuery = `
      INSERT INTO pets VALUES (NULL, ${newPost.toString()});
      `
       sql.query(createPetTableQuery, (err, result) => {
        if(err) console.log(err)
       })

       sql.query(createPostQuery, (err, result) => {
        if(err) console.log(err)
        else {
            const updateUserQuery = `UPDATE users SET uploadPetsId="${result.insertId}" where userId="${userId}";`
            sql.query(updateUserQuery, (err, upres) => {
                if(err) console.log(err)
            })
            return res.json({message : "Created Post..."})
        }
       })
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

const getAllPets = async(req, res) => {
    try {
        const adoptTypeQuery = `
        SELECT * FROM pets;
        `
        sql.query(adoptTypeQuery, (err, result) => {
            if(err) console.log(err)
            else{
                return res.status(200).send(result);
            }
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {
    createPost,
    getAllPets
}