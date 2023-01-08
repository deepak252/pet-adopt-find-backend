const express = require("express");
const route = express.Router();
const adminController = require("../controllers/adminController");
const { auth } = require("../middlewares/auth");

route.get("/admin/getAllUsers", adminController.allUsers);
route.get("/admin/getUserById/:id", adminController.getUserById);
route.post(
  "/admin/verification/:requestId",
  auth,
  adminController.verificationUpdate
);

module.exports = route;
