const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/jwtVerify");
const userPerms = require("../middleware/usePerms");
const Movie = require('../models/movie')
const fetchUser = require('../middleware/fetchUser')
const scopedRatings = require('../methods/scopedRatings')
const Rating = require('../models/rating');
const User = require("../models/user");
const Show = require("../models/show");

router.post('/get-movies', verifyAccessToken, userPerms('isAdmin'), async (req, res) => {
    try {
        let movies = await Movie.find({})
        res.status(200).json({ success: true, content: movies })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

router.post('/get-shows', verifyAccessToken, userPerms('isAdmin'), async (req, res) => {
    try {
        let shows = await Show.find({})
        res.status(200).json({ success: true, content: shows })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

router.post('/get-profile', verifyAccessToken, fetchUser, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.verify.id }).select('email username role')
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

router.post('/get-ratings', verifyAccessToken, fetchUser, async (req, res) => {
    let rating = await Rating.find({ userID: req.user._id })
    res.json({ success: true, ratings: await scopedRatings(req.user, rating) })
})




module.exports = router