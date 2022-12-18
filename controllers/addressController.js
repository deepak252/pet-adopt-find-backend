"use strict"

const Address = require("../model/Address");
const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");
module.exports.insertAddress = async(addressLine, city, state, pincode, coordinates) => {
    try{
        const newAddress = new Address(addressLine, city, state, pincode,coordinates);
        await query(sqlQueries.createAddressTable());
        var result =  await query(sqlQueries.insertAddress(newAddress));
        return result.insertId;
        
    }catch(err){
        console.error(err);
    }
        
}
