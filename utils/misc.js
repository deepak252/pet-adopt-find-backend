const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");

exports.userById=async (userId)=>{
    try{
        let result = await query(sqlQueries.getUser('userId', userId))
        if(result.length!=0){
            return result[0]
        }
    }catch(e){
        console.log(e)
    }
}


exports.petById=async (petId)=>{
    try{
        var pet = await query(sqlQueries.getPetById(petId));
        if(pet.length!=0){
            pet=pet[0];

            pet.owner = JSON.parse(pet.owner)
            pet.photos = pet.photos.split(',')
            return pet
        }
    }catch(e){
        console.log(e)
    }
}

exports.getReqById = async (reqId) => {
    try {
        var request = await query(sqlQueries.getReqById(reqId));
        if(request.length != 0){
            request = request[0];

            request.pet = JSON.parse(request.pet);
            request.requestedBy = JSON.parse(request.requestedBy);
            request.requestedTo = JSON.parse(request.requestedTo);
            request.pet.photos = request.pet.photos.split(',')
            return request;
        }
        return request;
    } catch (error) {
        console.log(error)
    }
}