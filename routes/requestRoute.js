const express = require("express");
const route = express.Router();
const requestController = require("../controllers/requestController")

//make a adoption request of a pet
route.post("/pet/adoptrequest/:petId", requestController.adoptRequest);

//get All users who requested for adoption of a pet
route.get("/pet/getrequests/:petId", requestController.getPetAdoptRequests);


//get All requests for adoption of pets by a user
route.get("/user/allrequests/:userId", requestController.getAllRequestsByUser);

module.exports = route;