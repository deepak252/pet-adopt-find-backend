"use strict";

const Chat = require("../model/Chat");
const { query } = require("../db");
const sqlQueries = require("../utils/sqlQueries");
const UserService = require("./userService");
const Conversation = require("../model/Conversation");


module.exports = class MessageService{
  /**
   * Create a room/conversation
   */
   static createRoom = async (userId1,userId2) => {
    try {
      await query(sqlQueries.createConversationTable());
      
      let user1 = await UserService.userById(userId1);
      let user2 = await UserService.userById(userId2);
      if(!user1 || !user2){
        throw "Invalid user"
      }
      var result = await this.getRoomByBothUsers(userId1,userId2);
      if(result){
        console.log("Room already exist");
        // "Room already exist!"
        return result;
      }
      
      console.log("createRoom ",{userId1,userId2},user1.email, user2.email);
      const conversation = new Conversation(userId1, userId2,new Date().toISOString());
      result = await query(sqlQueries.createConversation(conversation));
      if(!result){
        throw "Couldn't create room";
      }
      result = await this.getRoomById(result.insertId);
      if(!result){
        throw "Couldn't create room";
      }
      return result;
    } catch (error) {
      console.log("createRoom ",error);
      return {
        "error" : typeof error === 'string' ? error : error.message
      };
    }
  }
  
  static getRoomById=async(conversationId)=>{
    let conv = await query(sqlQueries.conversationById(conversationId))
    if(conv.length!=0 ){
      return conv[0];
    }
  }

  // userId1 is the Admin Id
  static getRoomByBothUsers=async(userId1, userId2)=>{
    let conv = await query(sqlQueries.conversationByBothUsers(userId1, userId2))
    if(conv.length!=0 ){
      return conv[0];
    }
  }

  static getAllRoomsByUser=async(userId)=>{
    return await query(sqlQueries.conversationByUser(userId))
  }

  static getMessage=async(chatId)=>{
    return await query(sqlQueries.chatById(chatId));
  }

  /**
   * To get all messages/chats from a room (conversation).
   */
  static getAllMessages = async (conversationId) => {
    try {
      await query(sqlQueries.createConversationTable());
      await query(sqlQueries.createChatTable());

      return await query(sqlQueries.allChats(conversationId));
      
    } catch (error) {
      console.log("getAllMessages ",error);
      return {
        "error" : typeof error === 'string' ? error : error.message
      };
    }
  }

  /**
   * Add message to database
   */
  static addMessage = async (conversationId, senderId, message) => {
    try {
      await query(sqlQueries.createConversationTable());
      await query(sqlQueries.createChatTable());
      
      const newMessage = new Chat(conversationId, senderId, message, new Date().toISOString());
      var result = await query(sqlQueries.insertMessage(newMessage));
      return await this.getMessage(result.insertId);
      
    } catch (error) {
      console.log("addMessage ",error);
      return {
        "error" : typeof error === 'string' ? error : error.message
      };
    }
  }


  

}

