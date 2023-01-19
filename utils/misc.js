const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");

exports.userById=async (userId)=>{
    try{
        let result = await query(sqlQueries.getUserById( userId))
        if(result.length!=0){
            result = result[0]
        }
        result.address =  JSON.parse(result.address);
        return result;
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

function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

exports.getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2)  => {
   // console.log(lat1,lon1,lat2,lon2)
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
   // console.log(d)
    return d;
  }
  