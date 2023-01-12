"use strict";

const Conversation = require("../model/Conversation");
const Chat = require("../model/Chat");
const { query } = require("../db");
const sqlQueries = require("../utils/sqlQueries");
const { successMessage, errorMessage } = require("../utils/responseUtils");

module.exports.createConversationRoom = async (req, res) => {
  try {
    const { secondMember } = req.body;
    await query(sqlQueries.createConversationTable());
    const newConversation = new Conversation(req.userId, secondMember);
    const result = await query(sqlQueries.addUsersInConvo(newConversation));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.showContactList = async (req, res) => {
  try {
    const result = await query(sqlQueries.showConversationList(req.userId));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = new Chat(req.params.conversationId, req.userId, message, new Date());
    await query(sqlQueries.createTableChat());
    const result = await query(sqlQueries.insertMessageQuery(newMessage));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.getAllMessages = async (req, res) => {
  try {
    const result = await query(sqlQueries.showChats(req.params.conversationId));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};
