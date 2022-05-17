const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/jwtVerify");
const userPerms = require("../middleware/usePerms");
const Movies = require('../models/movie')
const fetchUser = require('../middleware/fetchUser')
const scopedRatings = require('../methods/scopedRatings')
const Rating = require('../models/rating')

router.post('/get-content', verifyAccessToken, userPerms('isAdmin'), async (req, res) => {
    try {
        let movies = await Movies.find({})
        res.status(200).json({ success: true, movie: movies })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

router.post('/get-ratings', verifyAccessToken, fetchUser, async (req, res) => {
    let rating = await Rating.find({ userID: req.user._id})
    res.json({ success: true, ratings: await scopedRatings(req.user, rating)})
})




module.exports = router