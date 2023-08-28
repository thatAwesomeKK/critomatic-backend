const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/jwtVerify");
const Movie = require("../models/movie");
const Rating = require("../models/rating");
const Show = require("../models/show");
const showRatings = require("../models/showRatings");
const User = require("../models/user");

const decypherSlug = (slug) => {
  slug = slug.split("@");
  const contentType = slug[0];
  const content = slug[1];
  return { contentType, content };
};

router.post("/add", verifyAccessToken, async (req, res) => {
  try {
    const { contentID, rating, review } = req.body;
    const slug = req.query.slug;

    const contentType = decypherSlug(slug).contentType;

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

    await newRating.save()

    return res
      .status(200)
      .json({ success: true, message: "Review Added SuccessFully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/get", async (req, res) => {
  try {
    const contentID = req.query.contentid;
    const slug = req.query.slug;

    const contentType = decypherSlug(slug).contentType;

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

router.put("/cal-user-rating", async (req, res) => {
  const movieID = req.headers.contentid;

  try {
    let foundMovie = await Movie.findById({ _id: movieID });
    if (!foundMovie) {
      return res.status(500).json({ error: "Movie Not Found" });
    }

    let allRatings = await Rating.find({ movieID: movieID }).select(
      "userRating.rating"
    );

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

    await Movie.findByIdAndUpdate(
      foundMovie._id,
      { $set: newUserRating },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "User Rating has been updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});
router.put("/cal-user-rating-show", async (req, res) => {
  const showID = req.headers.contentid;

  try {
    let foundShow = await Show.findById({ _id: showID });
    if (!foundShow) {
      return res.status(500).json({ error: "Show Not Found" });
    }

    let allRatings = await showRatings
      .find({ showID: showID })
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

    await Show.findByIdAndUpdate(
      foundShow._id,
      { $set: newUserRating },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "User Rating has been updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.delete("/del-rating-movie", verifyAccessToken, async (req, res) => {
  try {
    const userID = req.verify.id;
    const { ratingID } = req.body;

    let foundRating = await Rating.findById(ratingID);

    if (!foundRating) {
      return res.status(500).json({ success: false, error: "No Movie Found" });
    }

    let foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(500).json({ success: false, error: "No User Found" });
    }

    await Rating.findByIdAndDelete(ratingID);

    return res
      .status(200)
      .json({ success: true, message: "Review Deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});
router.delete("/del-rating-show", verifyAccessToken, async (req, res) => {
  try {
    const userID = req.verify.id;
    const { ratingID } = req.body;

    let foundRatingShow = await showRatings.findById(ratingID);

    if (!foundRatingShow) {
      return res.status(500).json({ success: false, error: "No Show Found" });
    }

    let foundUser = await User.findById(userID);
    if (!foundUser) {
      return res.status(500).json({ success: false, error: "No User Found" });
    }

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
