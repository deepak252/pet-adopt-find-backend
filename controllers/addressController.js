"use strict"

const Address = require("../model/Address");
const sql = require('../db');

const inputAddress = async(addressLine, city, state, pincode, coordinates) => {
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
          sql.query(createAddressTableQuery, (err, result) => {
            if(err)
             console.log(err);
        })
        return sql.query(insertAddressQuery, (err, result) => {
            if(err) console.log(err);
            else {
               return result.insertId;
            }
        })
       
}

module.exports = inputAddress;