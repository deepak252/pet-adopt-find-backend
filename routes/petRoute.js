const express = require("express");
const route = express.Router();
const petController = require("../controllers/petController");

//create a post for adoption of a Pet
route.post('/pet/createPet', petController.createPet);

//get All pets data
route.get('/pet/getAllPets', petController.getAllPets);

module.exports = route;

