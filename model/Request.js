class Request{
    constructor(adoptReqById, petId, verification, status, message, aadharCard, createdAt){
        this.adoptReqById = adoptReqById;
        this.petId = petId;
        this.verification = verification;
        this.status = status;
        this.message = message;
        this.aadharCard = aadharCard;
        this.createdAt = createdAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.petId}","${this.verification}","${this.status}","${this.message}","${this.aadharCard}","${this.createdAt}"`;
    }
}

module.exports = Request;