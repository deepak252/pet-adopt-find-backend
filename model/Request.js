class Request{
    constructor(adoptReqById, adoptReqToId, petId, requestedAt){
        this.adoptReqById = adoptReqById;
        this.adoptReqToId = adoptReqToId;
        this.petId = petId;
        this.requestedAt = requestedAt;
    }
    toString(){
        return `"${this.adoptReqById}","${this.adoptReqToId}","${this.petId}","${String(this.requestedAt)}"`;
    }
}

module.exports = Request;