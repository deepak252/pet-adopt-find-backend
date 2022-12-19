class Address{
    constructor(addressLine=null, city=null, state=null, pincode=null, coordinates=null){
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.coordinates = coordinates;
    }

    toString(){
        return `"${this.addressLine}","${this.city}","${this.state}
        ","${this.pincode}","${this.coordinates}"
        `;
    }
}

module.exports = Address;