const {petSqlObject, userSqlObject} = require("../utils/sqlJsonObjects");


///////USER TABLE QUERIES////////////
module.exports.createUserTable = () => `CREATE TABLE IF NOT EXISTS 
users (userId int(11) PRIMARY KEY AUTO_INCREMENT,
fullName varchar(30) NOT NULL,
email varchar(20),
password varchar(255),
mobile varchar(15),
addressId int(11),
profilePic varchar(255),
adoptPetsId varchar(21),
uploadPetsId varchar(21),
favouritePetsId varchar(21),
fcmToken varchar(11)
);`;
module.exports.insertUser = (user) => {
  return `INSERT INTO users VALUES 
    (NULL, ${user.toString()}, NULL, NULL, NULL, NULL, NULL, NULL);
    `;
};
module.exports.getUser = (column, val) => {
  return `SELECT * FROM users WHERE ${column} = "${val}"`;
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
        pincode varchar(15),
        coordinates varchar(80)
    );
    `
}
module.exports.insertAddress = (address) => {
    return `
    INSERT INTO address VALUES (NULL,${address.toString()})
    `
}
module.exports.editAddress = (addressLine, city, state, pincode, coordinates, addressId) => {
  return `
  update address 
  set addressLine = "${addressLine}", city = "${city}", 
  state = "${state}", pincode = "${pincode}", 
  coordinates = "${coordinates}" 
  where addressId = "${addressId}";
  `;
}
module.exports.deleteAddress = (addressId) => {
  return `
  delete from address where addressId = "${addressId}";
 `;
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
    verification varchar(15),
    status varchar(10),
    message varchar(500),
    aadharId varchar(30),
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
  SELECT requestId, verification, status, message, aadharId, JSON_OBJECT(
    ${petSqlObject()}
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, requestedAt 
  FROM requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId;
  `
}

module.exports.requestsByPetId = (column, val) => {
  return `
  SELECT requestId, verification, status, message, aadharId, JSON_OBJECT(
    ${petSqlObject()}
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, createdAt 
  FROM requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where pets.${column} = "${val}"
  `;
}
module.exports.requestsMade = (userId) => {
  return `
  SELECT requestId, verification, status, message, aadharId, JSON_OBJECT(
    ${petSqlObject()}   
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, createdAt from requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where reqBy.userId =${userId}
  `;
}

module.exports.requestsReceived = (userId) => {
  return `
  SELECT requestId, verification, status, message, aadharId, JSON_OBJECT(
    ${petSqlObject()}   
  ) as pet, JSON_OBJECT(
    ${userSqlObject('reqBy')} 
  ) as requestedBy, JSON_OBJECT(
    ${userSqlObject('reqTo')} 
  ) as requestedTo, createdAt from requests
  join pets on requests.petId = pets.petId
  join users as reqBy on requests.adoptReqById = reqBy.userId
  join users as reqTo on pets.userId = reqTo.userId
  where reqTo.userId =${userId}
  `;
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

module.exports.updateVerificationStatus = (status, requestId) => {
  return `
  update requests set verification="${status}" where requestId="${requestId}";
  `;
}