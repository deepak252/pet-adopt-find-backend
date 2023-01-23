"use strict"

const Address = require("../model/Address");
const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");
const { successMessage } = require("../utils/responseUtils");
module.exports.insertAddress = async(addressLine, city, state, country, pincode, longitude, latitude) => {
    try{
        const newAddress = new Address(addressLine, city, state, country ,pincode, longitude, latitude);
        await query(sqlQueries.createAddressTable());
        var result =  await query(sqlQueries.insertAddress(newAddress));
        return result.insertId;
        
    }catch(err){
        console.error(err);
    }
        
}

module.exports.getAddressById = async(req, res) => {
    try {
        const result = await query(sqlQueries.getAddressById(req.params.addressId));
        return res.json(successMessage(result)); 
    } catch (error) {
        return res.status(400).send(error.message);
    }
}
