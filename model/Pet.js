class Pet{
    constructor(userId, petName, breed, age, address_id, photos, category, petStatus, createdAt){
        this.userId = userId;
        this.petName = petName;
        this.breed = breed;
        this.age = age;
        this.address_id = address_id;
        this.photos = photos;
        this.category = category;
        this.petStatus = petStatus;
        this.createdAt = createdAt;
    }
    toString(){
        return `
           "${this.userId}", "${this.address_id}","${this.petName}","${this.breed}","${this.age}",
          "${this.photos}","${this.category}","${this.petStatus}","${this.createdAt}"
        `;
    }

    // static createTableQuery(){
    //     return `
    //     CREATE TABLE IF NOT EXISTS pets(
    //     petId int(11) PRIMARY KEY AUTO_INCREMENT,
    //     userId int(11),
    //     addressId int(11),
    //     FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
    //     FOREIGN KEY (addressId) REFERENCES address(addressId) ON DELETE CASCADE,
    //     petName varchar(25),
    //     breed varchar(25),
    //     age int(8),
    //     photos varchar(255),
    //     category varchar(25),
    //     petStatus varchar(10),
    //     createdAt varchar(20)
    //    )`
    // }
}

module.exports = Pet;