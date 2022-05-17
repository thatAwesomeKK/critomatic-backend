const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require('../middleware/jwtVerify')
const Rating = require('../models/rating')

router.post('/add', verifyAccessToken, async (req, res) => {
    try {
        const { movieID, rate, review } = req.body
        const userID = req.verify.id

        let savedMovie = await Rating.findOne({ movieID })
        let savedUser = await Rating.findOne({userID})
        if (savedMovie && savedUser) {
            return res.status(500).json({ success: false, message: "Rating Already Available" })
        }

        let rating = new Rating({
            movieID,
            userID,
            userRating: { rating: rate, review }
        })
        await rating.save()

        return res.status(200).json({ success: true, message: "Review Added SuccessFully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

})

module.exports = router