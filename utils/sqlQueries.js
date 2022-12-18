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
fcmId int(11)
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
    age varchar(8),
    photos varchar(255),
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
join address on pets.addressId = address.addressId;
`;
module.exports.getPet = (petId) => {
    return `
    select addressId from pets where petId = "${petId}";
    `
}
 