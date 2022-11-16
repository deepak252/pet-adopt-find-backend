class User{
    constructor(fullName, email, password, mobile){
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.mobile = mobile;
    }

    toString(){
        return `"${this.fullName}","${this.email}","${this.password}","${this.mobile}"`
    }
}
module.exports = User; 