const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { getAccessToken, getRefreshToken } = require("../methods/jwtCreation");
const {
  verifyRefreshToken,
  verifyAccessToken,
} = require("../middleware/jwtVerify");
const fetchUser = require("../middleware/fetchUser");
const { cloudinary } = require("../cloudinary");

const cookieConfig = {
  sameSite: "none",
  secure: true,
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
};

//Endpoint for Registering /api/auth/register
router.post(
  "/register",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //validating the body values
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //if error then return
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      //checking if user exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "A User With This Email Already Exists",
        });
      }

      //Encrypting the Password, even Devs cannot see.
      let salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, salt);

      //saving the User
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: secPass,
      });
      await newUser.save();

      //successfully created the new User
      return res
        .status(200)
        .json({ success: true, message: "Successfully Registered" });
    } catch (error) {
      return res
        .status(500)
        .send({ success: false, error: "Internal Server Error" });
    }
  }
);

//Endpoint for login /api/auth/login
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      //validating the body values
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      //Checking if user with email exists
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return res
          .status(400)
          .json({ success: false, error: "Wrong Credentials" });
      }

      const passwordCompare = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success: false, error: "Wrong Credentials" });
      }

      const accessToken = await getAccessToken({ id: foundUser._id });

      //setting refreshToken in Cookie
      res.cookie("accessToken", "Bearer " + accessToken, cookieConfig);
      return res.status(200).json({
        success: true,
        message: "Logged In Successfully!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }
);

//Endpoint for logout /api/auth/logout
router.get("/logout", async (req, res) => {
  try {
    //Clearing Cookies on Client
    res.clearCookie("refreshToken", cookieConfig);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});

//Endpoint for refreshing AccessToken /api/auth/refresh-token
// router.post("/refresh-token", verifyRefreshToken, async (req, res) => {
//   try {
//     const user = await User.findById({ _id: req.verify.id });
//     if (!user) {
//       res.clearCookie("refreshToken", cookieConfig);
//       return res.json({ success: false });
//     }
//     if (user.tokenVersion !== req.verify.tokenVersion) {
//       res.clearCookie("refreshToken", cookieConfig);
//       return res.json({ success: false, error: "Token Error" });
//     }
//     const accessToken = await getAccessToken({ id: req.verify.id });
//     res.cookie(
//       "refreshToken",
//       await getRefreshToken({
//         id: req.verify.id,
//         tokenVersion: user.tokenVersion,
//       }),
//       cookieConfig
//     );
//     return res.json({ success: true, accessToken: `Bearer ${accessToken}` });
//   } catch (error) {
//     res.clearCookie("refreshToken", cookieConfig);
//     return res.status(500).json({ success: false, error: error });
//   }
// });

//Endpoint for refreshing AccessToken /api/auth/verify-refresh-token
router.get("/verify-access-token", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.verify.id });
    if (!user) {
      res.clearCookie("accessToken", cookieConfig);
      return res.json({ success: false, error: "User Does not exists" });
    }
    if (user.tokenVersion !== req.verify.tokenVersion) {
      res.clearCookie("accessToken", cookieConfig);
      return res.json({ success: false, error: "Token Error" });
    }
    return res.json({ success: true, message: "Access token verified!" });
  } catch (error) {
    res.clearCookie("accessToken", cookieConfig);
    return res.status(500).json({ success: false, error: error });
  }
});

//Endpoint fro Changing token version /api/auth/token-version
router.post("/token-version", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, error: "User Does not Exists" });
    }
    await User.findByIdAndUpdate(
      { _id: user._id },
      { tokenVersion: user.tokenVersion + 1 }
    );
    const refreshToken = await getRefreshToken({
      id: user._id,
      tokenVersion: user.tokenVersion + 1,
    });
    res.cookie("refreshToken", refreshToken, cookieConfig);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});

router.put("/update-user", verifyAccessToken, fetchUser, async (req, res) => {
  try {
    const { pfp, username } = req.body;
    //Uploading the pfp
    const user = req.verify;
    console.log(user);
    let updUser = {};

    if (pfp) {
      const response = await cloudinary.uploader.upload(pfp, {
        upload_preset: "profile_pics",
      });
      updUser.pfp = response.secure_url;
    }
    if (username) {
      updUser.username = username;
    }
    await User.findByIdAndUpdate({ _id: user.id }, updUser);
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
