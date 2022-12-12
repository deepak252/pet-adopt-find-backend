const express = require("express");
const route = express.Router();
const requestController = require("../controllers/requestController")

route.post("/pet/adoptrequest/:petId", requestController.adoptRequest);

route.get("/pet/getrequests/:petId", requestController.getPetAdoptRequests);

module.exports = route;