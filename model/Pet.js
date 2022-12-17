class Pet{
    constructor(userId, petName, petInfo, breed, age, address_id, photos, category, gender, petStatus, createdAt){
        this.userId = userId;
        this.petName = petName;
        this.petInfo = petInfo;
        this.breed = breed;
        this.age = age;
        this.address_id = address_id;
        this.photos = photos;
        this.category = category;
        this.gender = gender;
        this.petStatus = petStatus;
        this.createdAt = createdAt;
    }
    toString(){
        return `
           "${this.userId}", "${this.address_id}","${this.petName}","${this.petInfo}","${this.breed}","${this.age}",
          "${this.photos}","${this.category}","${this.gender}","${this.petStatus}","${String(this.createdAt)}"
        `;
    }
}

module.exports = Pet;