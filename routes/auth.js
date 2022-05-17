const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user')
const { getAccessToken, getRefreshToken } = require("../methods/jwtCreation");
const {verifyRefreshToken} = require('../middleware/jwtVerify')

router.post('/register', [body("email", "Enter a Valid Email").isEmail(),
body("username").isLength({ min: 3 }),
body("password").isLength({ min: 5 })],
    async (req, res) => {
        try {
            //validating the body values
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                //if error then return
                return res.status(400).json({ errors: errors.array() });
            }

            //checking if user exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({ error: "A User With This Email Already Exists" });
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
            await newUser.save()

            return res.status(200).json({ success: true, message: "Successfully Registered" });
        } catch (error) {
            return res.status(500).send({ error: "Internal Server Error" });
        }
    })

router.post('/login', [body("email", "Enter a Valid Email").isEmail(), body("password").isLength({ min: 5 })], async (req, res) => {

    try {
        const { email, password } = req.body

        //validating the body values
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Checking if user with email exists
        let foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(400).json({ error: "Wrong Credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, foundUser.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Wrong Credentials" })
        }

        let accessToken = await getAccessToken({ id: foundUser._id });
        let refreshToken = await getRefreshToken({ id: foundUser._id, tokenVersion: foundUser.tokenVersion });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res.status(200).json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post("/refresh-token", verifyRefreshToken, async (req, res) => {
    try {
        let user = await User.findById({ _id: req.verify.id });
        if (!user) {
            return res.json({ success: false, accessToken: "" });
        }
        if (user.tokenVersion !== req.verify.tokenVersion) {
            return res.json({ success: false, error: "Token Error" });
        }
        let accessToken = await getAccessToken({ id: req.verify.id });
        res.cookie("refreshToken", await getRefreshToken({ id: req.verify.id, tokenVersion: user.tokenVersion }), { httpOnly: true });
        return res.json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
});

router.post("/token-version", async (req, res) => {
    try {
        const { email } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, error: "User Does not Exists" });
        }
        await User.findByIdAndUpdate({_id: user._id}, {tokenVersion: user.tokenVersion + 1})
        let refreshToken = await getRefreshToken({ id: user._id, tokenVersion: user.tokenVersion + 1 })
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
});



module.exports = router