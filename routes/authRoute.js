const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");
//SignUP
route.post('/auth/signup', authController.signUp);
//SignIn 
route.post('/auth/signin', authController.signIn);
//Reset User's Password
route.post('/auth/resetPassword', authController.resetPassword);

module.exports = route;