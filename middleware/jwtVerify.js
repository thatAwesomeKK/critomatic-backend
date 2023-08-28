const jwt = require("jsonwebtoken");
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const cookieConfig = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
};

//this function will verify refresh token
const verifyRefreshToken = async (req, res, next) => {
  const token = await req.headers["x-refresh-token"];
  if (!token) {
    res.clearCookie("refreshToken", cookieConfig);
    return res.json({ success: false, error: "Token Invalid" });
  }
  try {
    req.verify = jwt.verify(token, jwtRefreshSecret);
  } catch (error) {
    res.clearCookie("refreshToken", cookieConfig);
    return res
      .status(401)
      .json({ success: false, error: "Internal Server Error" });
  }
  next();
};

const verifyAccessToken = async (req, res, next) => {
  try {
    const token = await req.headers["x-access-token"].split(" ")[1];
    if (!token) {
      return res.json({ success: false });
    }
    req.verify = jwt.verify(token, jwtAccessSecret);
  } catch (error) {
    return res.status(401).json({ success: false, error: "Not Authorized" });
  }
  next();
};

module.exports = { verifyRefreshToken, verifyAccessToken };
