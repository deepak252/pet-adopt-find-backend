class Request{
    constructor(adoptReqById, petId, verification, status, message, aadharId, requestedAt){
        this.adoptReqById = adoptReqById;
        this.petId = petId;
        this.verification = verification;
        this.status = status;
        this.message = message;
        this.aadharId = aadharId;
        this.requestedAt = requestedAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.petId}","${this.verification}","${this.status}","${this.message}","${this.aadharId}","${String(this.requestedAt)}"`;
    }
}

module.exports = Request;