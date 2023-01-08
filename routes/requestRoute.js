const express = require("express");
const route = express.Router();
const requestController = require("../controllers/requestController");
const { auth } = require("../middlewares/auth");


//make a adoption request of a pet
route.post("/request/create/:petId", auth, requestController.createRequest);

//delete request
route.delete("/request/delete/:requestId", auth, requestController.deleteAdoptionRequest);

//update status of adoption of pet - Pending, Approved,  Rejected
route.put("/request/update/:requestId", auth, requestController.updateStatusRequest);

//get all requests received for a pet
route.get("/request/requestsByPetId/:petId", auth, requestController.requestsByPetId);

//All requests received to user
route.get("/request/requestsReceived", auth, requestController.requestsReceived);

//get All requests for adoption of pets by a user
route.get("/request/requestsMade", auth, requestController.requestsMade);


module.exports = route;