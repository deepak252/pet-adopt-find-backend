class Request{
    constructor(adoptReqById, petId, status, requestedAt){
        this.adoptReqById = adoptReqById;
        this.petId = petId;
        this.status = status;
        this.requestedAt = requestedAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.petId}","${this.status}","${String(this.requestedAt)}"`;
    }
}

module.exports = Request;