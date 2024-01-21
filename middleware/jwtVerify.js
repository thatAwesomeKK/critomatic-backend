const jwt = require("jsonwebtoken");
// const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtPublicKey = process.env.JWT_PUBLIC_KEY;

// const cookieConfig = {
//   sameSite: "none",
//   secure: true,
//   httpOnly: true,
//   domain: process.env.COOKIE_DOMAIN,
// };

//this function will verify refresh token
// const verifyRefreshToken = async (req, res, next) => {
//   const token = await req.headers["x-refresh-token"];
//   if (!token) {
//     res.clearCookie("refreshToken", cookieConfig);
//     return res.json({ success: false, error: "Token Invalid" });
//   }
//   try {
//     req.verify = jwt.verify(token, jwtRefreshSecret);
//   } catch (error) {
//     res.clearCookie("refreshToken", cookieConfig);
//     return res
//       .status(401)
//       .json({ success: false, error: "Internal Server Error" });
//   }
//   next();
// };

//Verify Access Token
const verifyAccessToken = async (req, res, next) => {
  try {
    const token = await req.cookies.accessToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Not Authorized" });
    }
    req.verify = jwt.verify(token, jwtPublicKey, { algorithms: ["RS256"] });
  } catch (error) {
    return res.status(401).json({ success: false, error: "Not Authorized" });
  }
  next();
};

module.exports = { verifyAccessToken };
