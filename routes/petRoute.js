const express = require("express");
const route = express.Router();
const petController = require("../controllers/petController");


route.post('/auth/createpost', petController.createPost);

route.get('/auth/getposts', petController.getAllPets);

module.exports = route;

