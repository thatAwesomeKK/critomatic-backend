const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require('../middleware/jwtVerify');
const Movie = require("../models/movie");
const Rating = require('../models/rating');
const Show = require("../models/show");
const showRatings = require("../models/showRatings");
const User = require("../models/user");

router.post('/add', verifyAccessToken, async (req, res) => {
    try {
        const { contentID, rate, review } = req.body
        const userID = req.verify.id

        let savedMovieUser = await Rating.findOne({ movieID: contentID, userID })
        if (savedMovieUser) {
            return res.status(500).json({ success: false, error: "Rating Already Available" })
        }

        let rating = new Rating({
            movieID: contentID,
            userID,
            userRating: { rating: rate, review }
        })
        await rating.save()

        return res.status(200).json({ success: true, message: "Review Added SuccessFully" })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }

})
router.post('/add-show', verifyAccessToken, async (req, res) => {
    try {
        const { contentID, rate, review } = req.body
        const userID = req.verify.id

        let savedShowUser = await showRatings.findOne({ showID: contentID, userID })
        if (savedShowUser) {
            return res.status(500).json({ success: false, error: "Rating Already Available" })
        }

        let rating = new showRatings({
            showID: contentID,
            userID,
            userRating: { rating: rate, review }
        })
        await rating.save()

        return res.status(200).json({ success: true, message: "Review Added SuccessFully" })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }

})

router.get("/get", async (req, res) => {
    try {
        const movieID = req.headers.movieid

        let ratings = await Rating.find({ movieID }).populate({ path: "userID", model: User, select: 'username pfp' })
        return res.status(200).json({ success: true, ratings })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }
})

router.get("/get-show", async (req, res) => {
    try {
        const showID = req.headers.showid

        let ratings = await showRatings.find({ showID }).populate({ path: "userID", model: User, select: 'username pfp' })
        return res.status(200).json({ success: true, ratings })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }
})

router.put("/cal-user-rating", async (req, res) => {
    const movieID = req.headers.contentid

    try {
        let foundMovie = await Movie.findById({ _id: movieID })
        if (!foundMovie) {
            return res.status(500).json({ error: 'Movie Not Found' });
        }

        let allRatings = await Rating.find({ movieID: movieID }).select('userRating.rating')

        let ratingSum = 0

        for (let i = 0; i < allRatings.length; i++) {
            const element = await allRatings[i];
            ratingSum += element.userRating.rating 
        }
        let averageRating = ratingSum / allRatings.length
        let rounded = Math.round(averageRating * 10) / 10

        const newUserRating = {}
        if (rounded) { newUserRating.userRating = rounded }

        await Movie.findByIdAndUpdate(foundMovie._id, { $set: newUserRating }, { new: true })
        res.status(200).json({ success: true, message: "User Rating has been updated" })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }

})
router.put("/cal-user-rating-show", async (req, res) => {
    const showID = req.headers.contentid

    try {
        let foundShow = await Show.findById({ _id: showID })
        if (!foundShow) {
            return res.status(500).json({ error: 'Show Not Found' });
        }

        let allRatings = await showRatings.find({ showID: showID }).select('userRating.rating')

        let ratingSum = 0

        for (let i = 0; i < allRatings.length; i++) {
            const element = await allRatings[i];
            ratingSum += element.userRating.rating 
        }
        let averageRating = ratingSum / allRatings.length
        let rounded = Math.round(averageRating * 10) / 10

        const newUserRating = {}
        if (rounded) { newUserRating.userRating = rounded }

        await Show.findByIdAndUpdate(foundShow._id, { $set: newUserRating }, { new: true })
        res.status(200).json({ success: true, message: "User Rating has been updated" })
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }

})

module.exports = router