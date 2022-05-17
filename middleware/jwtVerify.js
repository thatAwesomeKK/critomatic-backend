const jwt = require("jsonwebtoken");
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

//this function will verify refresh token
const verifyRefreshToken = async (req, res, next) => {
  let token = req.cookies.refreshToken;
  if (!token) {
    return res.json({ success: false, accessToken: "" });
  }
  try {
    req.verify = jwt.verify(token, jwtRefreshSecret);
  } catch (error) {
    return res.status(401).json({ error: "Internal Server Error" });
  }
  next()
};

//this function will verify access token
const verifyAccessToken = async (req, res, next) => {
  let token = req.body.accessToken.split(" ")[1]
  if (!token) {
    return res.json({ success: false, accessToken: "" });
  }
  try {
    req.verify = jwt.verify(token, jwtAccessSecret);
  } catch (error) {
    return res.status(401).json({ error: "Internal Server Error" });
  }
  next()
};


module.exports = { verifyRefreshToken, verifyAccessToken }
