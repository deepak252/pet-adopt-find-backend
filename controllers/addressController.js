"use strict"

const Address = require("../model/Address");
const {query} = require('../db');

module.exports.insertAddress = async(addressLine, city, state, pincode, coordinates) => {
    try{
        const newAddress = new Address(addressLine, city, state, pincode,coordinates);
        const createAddressTableQuery = `
        CREATE TABLE IF NOT EXISTS address(
            addressId int(11) PRIMARY KEY AUTO_INCREMENT,
            addressLine varchar(100),
            city varchar(15),
            state varchar(15),
            pincode varchar(15),
            coordinates varchar(80)
        );
        `
        const insertAddressQuery = `
        INSERT INTO address VALUES (NULL,${newAddress.toString()})
        `
        await query(createAddressTableQuery);
        var result =  await query(insertAddressQuery);
        return result.insertId;
        
    }catch(err){
        console.error(err);
    }
        
}
