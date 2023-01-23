const express = require("express");
const route = express.Router();
const notificationController = require("../controllers/NotificationController");
const { auth } = require("../middlewares/auth");

route.post('/notification/create', auth, notificationController.addNotification);

route.get('/notification/getAll', auth, notificationController.getAllNotify);

route.put("/notification/isRead", auth, notificationController.updateReadNotify);


module.exports = route