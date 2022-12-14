const express = require("express");
const route = express.Router();
const petController = require("../controllers/petController");

//create a post for adoption of a Pet
route.post('/auth/createpost', petController.createPost);

//get All pets data
route.get('/auth/getposts', petController.getAllPets);

module.exports = route;

