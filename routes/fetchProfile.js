const express = require("express");
const router = express.Router();
const { verifyAccessToken, verifyUnsafeAccessToken } = require("../middleware/jwtVerify");
const userPerms = require("../middleware/usePerms");
const Movie = require('../models/movie')
const fetchUser = require('../middleware/fetchUser')
const showRating = require('../models/showRatings')
const Rating = require('../models/rating');
const User = require("../models/user");
const Show = require("../models/show");

//Get the movies on the Admin Panel
router.post('/get-movies', verifyUnsafeAccessToken, userPerms('isAdmin'), async (req, res) => {
    try {
        let movies = await Movie.find({})
        res.status(200).json({ success: true, content: movies })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

//Get the Tv Shows on the Admin Panel
router.post('/get-shows', verifyUnsafeAccessToken, userPerms('isAdmin'), async (req, res) => {
    try {
        let shows = await Show.find({})
        res.status(200).json({ success: true, content: shows })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

//Fetch the users Profile
router.post('/get-profile', verifyAccessToken, fetchUser, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.verify.id }).select('email username role pfp')
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
})

router.post('/get-ratings', verifyUnsafeAccessToken, async (req, res) => {
    try {
        let movieRatings = await Rating.find({ userID: req.verify.id }).populate({ path: 'movieID', model: Movie, select: 'title' })
        let showRatings = await showRating.find({ userID: req.verify.id }).populate({ path: 'showID', model: Show, select: 'title' })

        res.json({ success: true, movieRatings, showRatings })
    } catch (error) {
        res.status(401).json({ success: false, error: "Internal Server Error" })
    }
})




module.exports = router