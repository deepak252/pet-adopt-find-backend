const express = require("express");
const route = express.Router();
const petController = require("../controllers/petController");
const { auth } = require("../middlewares/auth");

//create a post for adoption of a Pet
route.post('/pet/createPet', auth, petController.createPet);

//get All pets data
route.get('/pet/getAllPets', auth, petController.getAllPets);

module.exports = route;

