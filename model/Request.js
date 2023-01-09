class Request{
    constructor(adoptReqById, petId, verification, status, message, aadharId, createdAt){
        this.adoptReqById = adoptReqById;
        this.petId = petId;
        this.verification = verification;
        this.status = status;
        this.message = message;
        this.aadharId = aadharId;
        this.createdAt = createdAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.petId}","${this.verification}","${this.status}","${this.message}","${this.aadharId}","${this.createdAt}"`;
    }
}

module.exports = Request;