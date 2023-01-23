const {petSqlObject, userSqlObject, addressSqlObject} = require("../utils/sqlJsonObjects");


///////USER TABLE QUERIES////////////
module.exports.createUserTable = () => `CREATE TABLE IF NOT EXISTS 
users (userId int(11) PRIMARY KEY AUTO_INCREMENT,
fullName varchar(30) NOT NULL,
email varchar(50),
password varchar(255),
mobile varchar(15),
addressId int(11),
FOREIGN KEY (addressId) REFERENCES address(addressId) ON DELETE CASCADE,
profilePic varchar(255),
adoptPetsId varchar(21),
uploadPetsId varchar(21),
favouritePetsId varchar(21),
fcmToken varchar(200)
);`;
module.exports.insertUser = (user) => {
  return `INSERT INTO users VALUES 
    (NULL, ${user.toString()}, NULL, NULL, NULL, NULL, NULL, NULL);
    `;
};

// select users.*,JSON_OBJECT(
// 	'addressId', address.addressId   
// ) as address from users
// left join address on users.addressId = address.addressId
// where users.userId=2

// SELECT * FROM users WHERE ${column} = "${val}"
module.exports.getAllUsers = () => {
  return `
    SELECT * FROM users left join address  on users.addressId = address.addressId;
  `;
};

module.exports.getUserById = (userId) => {
  return `
    SELECT users.*,JSON_OBJECT(
      ${addressSqlObject('address')} 
    ) AS address FROM users
    LEFT JOIN address ON users.addressId = address.addressId
    WHERE users.userId="${userId}";
  `;
};
module.exports.updateUserPassword = (hashedPassword, email) => {
  return `
    UPDATE users 
    set password = "${hashedPassword}"  
    WHERE email= "${email}";
    `;
};
module.exports.updateUser = (updatedCols, userId) => {
  return `
    UPDATE users
    set ${updatedCols}
    where userId = "${userId}"
`;
};
module.exports.deleteUser = (userId) => {
  return `
    delete from users 
    where userId="${userId}"
`;
};

/////////ADDRESS TABLE QUERIES//////////////
module.exports.createAddressTable = () => {
    return  `
    CREATE TABLE IF NOT EXISTS address(
        addressId int(11) PRIMARY KEY AUTO_INCREMENT,
        addressLine varchar(100),
        city varchar(15),
        state varchar(15),
        country varchar(15),
        pincode varchar(15),
        longitude double,
        latitude double
    );
    `
}
module.exports.insertAddress = (address) => {
    return `
    INSERT INTO address VALUES (NULL,${address.toString()})
    `
}
module.exports.editAddress = (addressLine, city, state, country, pincode, longitude, latitude, addressId) => {
  return `
  update address 
  set addressLine = "${addressLine}", city = "${city}", 
  state = "${state}", country = "${country}", pincode = "${pincode}", 
  longitude = "${longitude}", latitude = "${latitude}"
  where addressId = "${addressId}";
  `;
}
module.exports.deleteAddress = (addressId) => {
  return `
  delete from address where addressId = "${addressId}";
 `;
}

module.exports.getAddressById = (addressId) => {
  return `
  select * from address where addressId="${addressId}"; 
  `
}
/////// PET TABLE QUERIES ////////////////
module.exports.createPetTable = () => `CREATE TABLE IF NOT EXISTS pets(
    petId int(11) PRIMARY KEY AUTO_INCREMENT,
    userId int(11),
    addressId int(11),
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (addressId) REFERENCES address(addressId) ON DELETE CASCADE,
    petName varchar(25), 
    petInfo varchar(255),
    breed varchar(25),
    age int(8),
    photos varchar(2550),
    category varchar(25),
    gender varchar(10),
    petStatus varchar(10),
    createdAt varchar(100) 
    );
    `;
module.exports.insertPet = (post) => {
  return `INSERT INTO pets VALUES (NULL, ${post.toString()});`;
};
module.exports.getAllPets = () => `
SELECT * FROM pets
join users  on pets.userId = users.userId
join address on pets.addressId = address.addressId order by createdAt desc;
`;
module.exports.getPetsByStatus = (status) => {
    return `SELECT * FROM pets
    join users  on pets.userId = users.userId
    join address on pets.addressId = address.addressId where pets.petStatus="${status}" order by createdAt desc;`
}
module.exports.getPets = (petIds) => {
    return `
    select * from pets join users  on pets.userId = users.userId
    join address on pets.addressId = address.addressId where petId in (${petIds}) order by createdAt desc;
    `
}
/**
 * Populate user JSON Object in 'owner' column
 */
module.exports.getPetById = (petId) => {
  return `
    select pets.*,JSON_OBJECT(
      ${userSqlObject()}  
    ) as owner from pets
    join users on pets.userId = users.userId 
    join address on pets.addressId = address.addressId
    where petId="${petId}";
`
}


module.exports.editPetDetails = (petName, petInfo, breed, age, photos, category, gender, petStatus, petId) => {
  return `
  update pets 
  set petName="${petName}", petInfo="${petInfo}", breed="${breed}", age="${age}",
  photos="${photos}", category="${category}", gender="${gender}",  petStatus="${petStatus}"
  where petId="${petId}";
  `;
}
module.exports.deletePet = (petId) => {
  return `
  delete from pets where petId = "${petId}";
  `;
}
/////// Request TABLE QUERIES ////////////////
module.exports.createRequestTable = () => `
CREATE TABLE IF NOT EXISTS requests(
    requestId int(11) PRIMARY KEY AUTO_INCREMENT,
    adoptReqById int(11),
    FOREIGN KEY (adoptReqById) REFERENCES users(userId) ON DELETE CASCADE,
    petId int(11),
    FOREIGN KEY (petId) REFERENCES pets(petId) ON  DELETE CASCADE,
    status varchar(10),
    message varchar(500),
    aadharCard varchar(2550),
    createdAt varchar(100)
);
`
module.exports.insertRequest = (request) => {
  return `
  INSERT INTO requests VALUES (NULL, ${request.toString()});
 `;
} 

module.exports.getAllRequests = () => {
  return `
  SELECT requestId, status, message, aadharCard, JSON_OBJECT(
    ${petSqlObject()}
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requests.createdAt 
  FROM requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId;
  `
}

module.exports.requestsByPetId = (column, val) => {
  return `
  SELECT requestId, status, message, aadharCard, JSON_OBJECT(
    ${petSqlObject()}
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requests.createdAt 
  FROM requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where pets.${column} = "${val}"
  `;
}
module.exports.requestsMade = (userId) => {
  return `
  SELECT requestId, status, message, aadharCard, JSON_OBJECT(
    ${petSqlObject()}   
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requests.createdAt from requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where reqBy.userId =${userId}
  `;
}

module.exports.requestsReceived = (userId) => {
  return `
  SELECT requestId, status, message, aadharCard, JSON_OBJECT(
    ${petSqlObject()}   
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requests.createdAt from requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where reqTo.userId =${userId}
  `;
}

module.exports.getReqById = (requestId) => {
  return `
  SELECT requestId, status, message, aadharCard, JSON_OBJECT(
    ${petSqlObject()}   
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requests.createdAt from requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where requestId =${requestId}
  `
}

module.exports.deleteRequest = (requestId) => {
  return `
  delete from requests where requestId="${requestId}";
  `;
}

module.exports.updateStatus = (status, requestId) => {
  return `
  update requests set status="${status}" where requestId="${requestId}";
  `;
}

// module.exports.updateVerificationStatus = (status, requestId) => {
//   return `
//   update requests set verification="${status}" where requestId="${requestId}";
//   `;
// }

//Chats Feature
 //////////////CONVERSATION ROOM TABLE //////////////
 module.exports.createConversationTable = () => `
 CREATE TABLE IF NOT EXISTS conversations(
  conversationId int(11) PRIMARY KEY AUTO_INCREMENT,
  userId1 int(11),
  userId2 int(11),
  FOREIGN KEY (userId1) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (userId2) REFERENCES users(userId) ON DELETE CASCADE,
  createdAt varchar(100)
  );
 `
/**
 * Insert row in conversations(room) table.
 */
module.exports.createConversation = (conversation) => {
  return `
  INSERT INTO conversations VALUES
  (NULL, ${conversation.toString()});
  `
}

/**
 * To get Conversation (Room) by conversationId 
 */
module.exports.conversationById = (conversationId) => {
  return `
  SELECT conversationId, JSON_OBJECT(
    ${userSqlObject('u1')}
  ) AS user1, JSON_OBJECT(
    ${userSqlObject('u2')}   
  ) AS user2, createdAt FROM conversations
  JOIN users AS u1 ON conversations.userId1 = u1.userId
  JOIN users AS u2 ON conversations.userId2 = u2.userId
  WHERE conversations.conversationId = "${conversationId}";
  ` 
}

/**
 * user1 is Admin, user2 is normal user
 */
module.exports.conversationByBothUsers = (userId1,userId2) => {
  return `
  SELECT conversationId, JSON_OBJECT(
    ${userSqlObject('u1')}
  ) AS user1, JSON_OBJECT(
    ${userSqlObject('u2')}   
  ) AS user2, createdAt FROM conversations
  JOIN users AS u1 ON conversations.userId1 = u1.userId
  JOIN users AS u2 ON conversations.userId2 = u2.userId
  WHERE conversations.userId1="${userId1}" AND conversations.userId2="${userId2}"
  ORDER BY createdAt DESC;
  ` 
}

/**
 * to get rooms having user with given userId
 */
 module.exports.conversationByUser = (userId) => {
  return `
  SELECT conversationId, JSON_OBJECT(
    ${userSqlObject('u1')}
  ) AS user1, JSON_OBJECT(
    ${userSqlObject('u2')}   
  ) AS user2, createdAt FROM conversations
  JOIN users AS u1 ON conversations.userId1 = u1.userId
  JOIN users AS u2 ON conversations.userId2 = u2.userId
  WHERE conversations.userId1="${userId}" OR conversations.userId2="${userId}"
  ORDER BY createdAt DESC;
  ` 
}
 

/////////////////CHAT BETWEEN USERS TABLE /////////////

module.exports.createChatTable = () => `CREATE TABLE IF NOT EXISTS chats(
  chatId int(11) PRIMARY KEY AUTO_INCREMENT,
  conversationId int(11),
  FOREIGN KEY (conversationId) REFERENCES conversations(conversationId) ON DELETE CASCADE,
  senderId int(11),
  message varchar(500),
  createdAt varchar(100)
);
`

module.exports.insertMessage = (chat) => {
  return `
  INSERT INTO chats VALUES (NULL, ${chat.toString()});
  `
}

module.exports.allChats = (conversationId) => {
  return `
  SELECT * from chats 
  WHERE conversationId="${conversationId}"
  ORDER BY createdAt DESC;
  `
}

module.exports.chatById = (chatId) => {
  return `
  SELECT * from chats where chatId="${chatId}";
  `
}

//////////////Favourites /////////////
module.exports.getFavouritesPetByUserId = (userId) => {
  return `
   select * from pets where petId in (select favouritePetsId from users where userId = "${userId}");
  `
}

///////////// Notifications ///////////////////////
module.exports.createNotificationTable = () =>  `CREATE TABLE IF NOT EXISTS notifications(
  notificationId int(11) PRIMARY KEY AUTO_INCREMENT,
  userId int(11),
  notify_type varchar(50),
  title varchar(50),
  description varchar(255),
  isRead varchar(50),
  createdAt varchar(100) 
  );`;


module.exports.addNotification = (notification) => {
  return `INSERT INTO notifications VALUES (NULL, ${notification.toString()});`;
};

module.exports.getNotification = (userId) => {
  return `Select * from notifications where userId="${userId}"`;
}

module.exports.updateNotification  = (updatedCols, userId, notificationId) => {
  return `
    UPDATE notifications
    set ${updatedCols}
    where userId = "${userId}" and notificationId = "${notificationId}"
`;
};