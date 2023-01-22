const {query} = require('../db');
const sqlQueries = require("../utils/sqlQueries");


module.exports = class UserService{
    /**
     * MySQL userID is Required
     */
    static userById = async(userId)=>{
        let user = await query(sqlQueries.getUserById( userId))
        if(user.length!=0 ){
            return user[0]
        }
    }
    

}
