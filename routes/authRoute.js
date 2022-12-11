const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");

route.post('/auth/signup', authController.signUp);
route.post('/auth/signin', authController.signIn);
route.post('/auth/resetPassword', authController.resetPassword);

module.exports = route;