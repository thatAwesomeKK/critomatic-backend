const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/jwtVerify");
const Movie = require("../models/movie");
const Rating = require("../models/rating");
const Show = require("../models/show");
const showRatings = require("../models/showRatings");
const User = require("../models/user");

router.post("/add", verifyAccessToken, async (req, res) => {
  try {
    const { contentID, rating, review } = req.body;
    const contentType = req.query.contentType;
    const userID = req.verify.id;

    let finalContent = undefined;

    if (contentType === "movies") {
      finalContent = await Rating.findOne({ movieID: contentID, userID });
    } else if (contentType === "shows") {
      finalContent = await showRatings.findOne({ showID: contentID, userID });
    }

    if (finalContent) {
      return res
        .status(500)
        .json({ success: false, error: "Rating Already Available" });
    }

    let newRating;

    if (contentType === "movies") {
      console.log(contentType);
      newRating = new Rating({
        movieID: contentID,
        userID,
        userRating: { rating: rating, review },
      });
    } else if (contentType === "shows") {
      console.log(contentType);
      newRating = new showRatings({
        showID: contentID,
        userID,
        userRating: { rating: rating, review },
      });
    }

    await newRating.save();

    await calUserRating(contentID, contentType);

    return res
      .status(200)
      .json({ success: true, message: "Review Added SuccessFully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

const calUserRating = async (contentID, contentType) => {
  try {
    let foundContent;
    if (contentType === "movies")
      foundContent = await Movie.findById({ _id: contentID });
    else if (contentType === "shows")
      foundContent = await Show.findById({ _id: contentID });

    if (!foundContent) {
      return res.status(500).json({ error: "Content Not Found!" });
    }

    let allRatings;

    if (contentType === "movies")
      allRatings = await Rating.find({ movieID: contentID }).select(
        "userRating.rating"
      );
    else if (contentType === "shows")
      allRatings = await showRatings
        .find({ showID: contentID })
        .select("userRating.rating");

    let ratingSum = 0;

    for (let i = 0; i < allRatings.length; i++) {
      const element = await allRatings[i];
      ratingSum += element.userRating.rating;
    }
    let averageRating = ratingSum / allRatings.length;
    let rounded = Math.round(averageRating * 10) / 10;

    const newUserRating = {};
    if (rounded) {
      newUserRating.userRating = rounded;
    }

    if (contentType === "movies")
      await Movie.findByIdAndUpdate(
        foundContent._id,
        { $set: newUserRating },
        { new: true }
      );
    else if (contentType === "shows")
      await Show.findByIdAndUpdate(
        foundContent._id,
        { $set: newUserRating },
        { new: true }
      );
  } catch (error) {
    console.log(error);
  }
};

router.get("/get", async (req, res) => {
  try {
    const contentID = req.query.contentid;
    const contentType = req.query.contentType;
    let ratings = undefined;

    if (contentType === "movies") {
      ratings = await Rating.find({ movieID: contentID }).populate({
        path: "userID",
        model: User,
        select: "username pfp",
      });
    } else if (contentType === "shows") {
      ratings = await showRatings
        .find({ showID: contentID })
        .populate({ path: "userID", model: User, select: "username pfp" });
    }

    return res.status(200).json({ success: true, ratings });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});


router.delete("/del-rating", verifyAccessToken, async (req, res) => {
  try {
    const userID = req.verify.id;
    const { contentType, ratingID } = req.body;

    let foundRating;

    if (contentType === "movies") foundRating = await Rating.findById(ratingID);
    else if (contentType === "shows")
      foundRating = await showRatings.findById(ratingID);

    if (!foundRating) {
      return res.status(500).json({ success: false, error: "No Movie Found" });
    }

    const foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(500).json({ success: false, error: "No User Found" });
    }

    if (contentType === "movies") await Rating.findByIdAndDelete(ratingID);
    else if (contentType === "shows")
      await showRatings.findByIdAndDelete(ratingID);

    return res
      .status(200)
      .json({ success: true, message: "Review Deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
