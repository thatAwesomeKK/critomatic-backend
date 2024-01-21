const jwt = require("jsonwebtoken");
const jwtPublicKey = process.env.JWT_PUBLIC_KEY;

const cookieConfig = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
};

//Verify Access Token
const verifyAccessToken = async (req, res, next) => {
  try {
    const token = await req.cookies.accessToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Not Authorized" });
    }
    req.verify = jwt.verify(token, jwtPublicKey, { algorithms: ["RS256"] });
  } catch (error) {
    res.clearCookie("accessToken", cookieConfig);
    return res.status(401).json({ success: false, error: "Not Authorized" });
  }
  next();
};

module.exports = { verifyAccessToken };
