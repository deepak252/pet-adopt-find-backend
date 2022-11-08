const express = require("express");
const route = express.Router();
const {
    registerController, signInController,
  } = require("../controllers/user");

route.post('/auth/signup', registerController);

route.post('/auth/signin', signInController);

module.exports = route;