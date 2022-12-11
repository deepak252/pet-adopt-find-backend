// Get, Update, Delete User

const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

route.get('/user/getProfile', auth, userController.getUser);
route.post('/user/updateProfile', auth,userController.updateUser);

module.exports = route;