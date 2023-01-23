"use strict";

const Notification = require("../model/Notification");
const { query } = require("../db");
const { errorMessage, successMessage } = require("../utils/responseUtils");
const sqlQueries = require("../utils/sqlQueries");

module.exports.addNotification = async (req, res) => {
  try {
    const { userId, type, title, description, read } = req.body;
    const newNotification = new Notification(
      userId,
      type,
      title,
      description,
      read,
      new Date().toISOString()
    );
    await query(sqlQueries.createNotificationTable());
    const result = await query(sqlQueries.addNotification(newNotification));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.getAllNotify = async (req, res) => {
  try {
    const result = await query(sqlQueries.getNotification(req.userId));
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};

module.exports.updateReadNotify = async (req, res) => {
  try {
    const { read } = req.body;
    const updateCols = `read = ${read}`;
    const result = await query(
      sqlQueries.updateNotification(updateCols, req.userId)
    );
    return res.json(successMessage(result));
  } catch (error) {
    return res.status(400).json(errorMessage(error.message));
  }
};
