const jwt = require("jsonwebtoken");

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

const getAccessToken = async(data)=>{
    return jwt.sign(data, jwtAccessSecret, { expiresIn: '12h' }); 
}

const getRefreshToken = async(data)=>{
    return jwt.sign(data, jwtRefreshSecret, { expiresIn: '1d' });
}   

module.exports = {getAccessToken, getRefreshToken}