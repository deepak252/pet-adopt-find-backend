const express = require('express');
const app = express();
const cors = require('cors');

require('./db');


app.use(express.json());
app.use(cors());

app.use(require("./routes/authRoute"));
app.use(require("./routes/petRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/adminRoute"));
app.use(require("./routes/requestRoute"));
app.use(require("./routes/messageRoute"));
const PORT = process.env.PORT || "8000";

 var server = app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
});

//////Socket////
var io = require("socket.io")(server, {
    cors: "*",
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected");
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const user = getUser(receiverId);
      console.log(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        message,
      });
    });
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  