const express = require("express");
const route = express.Router();
const petController = require("../controllers/petController");
const { auth } = require("../middlewares/auth");

//create a post for adoption of a Pet
route.post('/pet/create', auth, petController.createPet);

//get All pets data
route.get('/pet/getAllPets', petController.getAllPets);

//get pets by status
route.get('/pet/getPets', petController.getPetsByStatus);

//get user's uploaded pet
route.get('/pet/mypets', auth, petController.getUploadedPetsByUser)

//get Pet by Id
route.get("/getpet/:petId", petController.getPetById)

//Edit pet post
route.put('/pet/editPet/:petId', auth, petController.editPet)

//delete pet post
route.delete('/pet/delete/:petId', auth, petController.deletePetPost);
module.exports = route;

