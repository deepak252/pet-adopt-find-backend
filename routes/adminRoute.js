const express = require("express");
const route = express.Router();
const adminController = require("../controllers/adminController")

route.get('/admin/getAllUsers', adminController.allUsers);
route.get('/admin/getUserById/:id', adminController.getUserById);
route.post('/admin/verification')

module.exports = route;  