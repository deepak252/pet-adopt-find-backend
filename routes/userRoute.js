const express = require("express");
const route = express.Router();
const {
    registerController,
  } = require("../controllers/user");

route.post('/auth/signup', registerController);

module.exports = route;