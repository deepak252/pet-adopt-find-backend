const { errorMessage, successMessage } = require("../utils/responseUtils");
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET,
} = require("../config/key");

exports.auth = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        if (!header || !header.includes("Bearer ")){
            return res.status(400).json(errorMessage('Bearer token is required'));
        }
        const token = header.split(' ')[1];

        let payload = jwt.verify(token, JWT_SECRET);
        if(!payload.id){
            return res.status(401).json(errorMessage('Not Signed In'));
        }
        req.userId =  payload.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json(errorMessage(error.message));
    }
};
