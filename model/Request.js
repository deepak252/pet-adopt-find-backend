class Request{
    constructor(adoptReqById, adoptReqToId, petId, status, requestedAt){
        this.adoptReqById = adoptReqById;
        this.adoptReqToId = adoptReqToId;
        this.petId = petId;
        this.status = status;
        this.requestedAt = requestedAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.adoptReqToId}","${this.petId}","${this.status}","${String(this.requestedAt)}"`;
    }
}

module.exports = Request;