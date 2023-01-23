const express = require('express');
const app = express();
const cors = require('cors');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const MessageService = require('./services/messageService');

app.use(express.json());
app.use(cors());

app.use(require("./routes/authRoute"));
app.use(require("./routes/petRoute"));
app.use(require("./routes/userRoute"));
app.use(require("./routes/adminRoute"));
app.use(require("./routes/requestRoute"));
app.use(require("./routes/notificationRoute"));

const PORT = process.env.PORT || "8000";

http.listen(PORT, () => {
	console.log(`Server is running on PORT: ${PORT}`);
});



// var server = app.listen(PORT, () => {
// 	console.log("server is running on port ", PORT);
// });

//////Socket////
// var io = require("socket.io")(server, {
// 	cors: "*",
// });

var liveUsers = {};  // {userId : 'socketId',...}

io.on("connection", (socket) => {

	socket.on('live',async ({userId})=>{
		if(!userId){
			return;
		}
		console.log(`User ${userId} is Live now, socket ID : ${socket.id}`)
		liveUsers[userId] = socket.id;
		const conversations = await MessageService.getAllRoomsByUser(userId);
		// console.log({conversations});
		socket.emit('getRooms', conversations);
		// Update live users in each room
		conversations.forEach((room)=>{
			var userId1 = JSON.parse(room.user1)?.userId;
			var userId2 = JSON.parse(room.user2)?.userId;
			var liveUsersInRoom = [];
			if(liveUsers[userId1]){
				liveUsersInRoom.push(userId1);
			}
			if(liveUsers[userId2]){
				liveUsersInRoom.push(userId2);
			}
			
			console.log({liveUsersInRoom})
			io.to([liveUsers[userId1],liveUsers[userId2]]).emit("getLiveUsers",{
				"conversationId" : room.conversationId,
				"liveUsers" : liveUsersInRoom
			})
			
		});

	})

	socket.on('createRoom',async ({userId1,userId2})=>{
		var result = await MessageService.createRoom(userId1, userId2)
		if(result.error){
			//Error
			return socket.emit("newRoom", result)
		}
		var sids = []; //socket ids
		var updatedRooms = [];
		
		if(liveUsers[userId1]){
			sids.push(liveUsers[userId1])
			//Emit updated rooms list to User1
			updatedRooms =  await MessageService.getAllRoomsByUser(userId1);
			io.to(liveUsers[userId1]).emit("getRooms",updatedRooms)
		}
		if(liveUsers[userId2]){
			sids.push(liveUsers[userId2])
			//Emit updated rooms list to User2
			updatedRooms =  await MessageService.getAllRoomsByUser(userId2);
			io.to(liveUsers[userId2]).emit("getRooms",updatedRooms)
		}
		//emit conversation/room to both users
		io.to(sids).emit("newRoom",result)
		
	})


	socket.on('joinRoom', async ({ roomId }) => {
		console.log('joinRoom', roomId);

		socket.join(roomId); 

		const msgs = await MessageService.getAllMessages(roomId);
		// console.log(msgs);
		socket.emit('getMessages', msgs);
	});

	socket.on('sendMessage', async ({  roomId,senderId, message }) => {
		let newMessage = await MessageService.addMessage(
			roomId,
			senderId,
			message,
		);

		io.to(roomId).emit('newMessage', newMessage);
	});


	socket.on("disconnect",async () => {
		console.log("User disconnected, ",socket.id);
		var uId; //disonnected userId
		Object.keys(liveUsers).forEach(userId => {
			if (liveUsers[userId] === socket.id) {
				uId = userId;
			  delete liveUsers[userId];
			}
		});
		if(uId){
			const conversations = await MessageService.getAllRoomsByUser(uId);
			//Update liveUsers to each room
			conversations.forEach((room)=>{
				var userId1 = JSON.parse(room.user1)?.userId;
				var userId2 = JSON.parse(room.user2)?.userId;
				var liveUsersInRoom = [];
				if(liveUsers[userId1]){
					liveUsersInRoom.push(userId1);
				}
				if(liveUsers[userId2]){
					liveUsersInRoom.push(userId2);
				}
				
				console.log({liveUsersInRoom})
				io.to([liveUsers[userId1],liveUsers[userId2]]).emit("getLiveUsers",{
					"conversationId" : room.conversationId,
					"liveUsers" : liveUsersInRoom
				})
				
			});
		}
	});

});
