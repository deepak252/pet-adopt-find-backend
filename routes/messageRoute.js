const express = require('express');
const { auth } = require('../middlewares/auth');
const route = express.Router();
const messageController = require('../controllers/messageController');

//create a conversation room
route.post('/conversation/createroom', auth, messageController.createConversationRoom);

//show contact list of a user
route.get('/conversation/users', auth, messageController.showContactList);

//Send message
route.post('/conversation/sendMessage/:conversationId', auth, messageController.sendMessage);

//Show all messages of a chatroom
route.get('/conversation/getAllChats/:conversationId', auth, messageController.getAllMessages);

module.exports = route;