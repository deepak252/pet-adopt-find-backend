const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");

route.post('/auth/signup', authController.signUp);

route.post('/auth/signin', authController.signIn);

module.exports = route;