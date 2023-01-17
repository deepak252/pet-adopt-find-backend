class Address{
    constructor(addressLine="New Delhi", city="", state="",  country="",pincode="", longitude="", latitude=""){
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    toString(){
        return `"${this.addressLine}","${this.city}","${this.state}","${this.country}","${this.pincode}","${this.longitude}","${this.latitude}"`;
    }
}

module.exports = Address;