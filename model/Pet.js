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
}

module.exports = Pet;