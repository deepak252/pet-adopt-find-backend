module.exports = {
    validateName(name) {
        if (!name){
            return "name is required"
        }
        if (typeof name != 'string' || name.trim().length < 1) {
            return "Invalid name"
        }
    },
    validateEmail(email) {
        if (!email) {
            return "email is required"
        }
        if (typeof email != 'string' || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return "Invalid email address";
        }
    },

    validatePhone(phone) {
        if (!phone) {
            return "phone number is required"
        }
        if (typeof phone != 'string' || !(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone))) {
            return "Invalid phone number";
        }
    },

    validatePassword(pswd) {
        if (!pswd) {
            return "password is required"
        }
        if (typeof pswd != 'string'){
            return "Invalid password"
        }
        if (/\s/g.test(pswd)) {
            return "Password should not contain space"
        }
        if (pswd.length < 6) {
            return "Password must contain atleast 6 characters"
        }
    }

}