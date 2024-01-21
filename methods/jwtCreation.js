const jwt = require("jsonwebtoken");

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

const getAccessToken = async (data) => {
  return jwt.sign(data, jwtPrivateKey, {
    expiresIn: "12h",
    algorithm: "RS256",
  });
};

const getRefreshToken = async (data) => {
  return jwt.sign(data, jwtRefreshSecret, { expiresIn: "1d" });
};

module.exports = { getAccessToken, getRefreshToken };
