const express = require("express");
const router = express.Router();
const Slider = require('../models/homeslider')
const Movie = require('../models/movie')
const Person = require('../models/person')
const MovieInfo = require('../models/movieInfo');
const Rating = require("../models/rating");

router.get("/get-slider-image", async (req, res) => {
  try {
    let news = await Slider.find({});
    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get All the Movies to be Displayed
router.get("/get-movies", async (req, res) => {
  try {
    let movie = await Movie.find({approved: true}).select('slug title summary bgimg releaseDate');
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get Single Movie with the Slug
router.get("/get-movie", async (req, res) => {
  try {
    let movie = await MovieInfo.findOne({ slug: req.query.slug }).populate({ path: 'movieID', model: Movie }).populate({ path: 'rating', model: Rating, select: 'rating userrating' }).populate({ path: 'movieID', populate:({path: 'crew.crewID', model: Person, select:'name img'})}).populate({ path: 'movieID', populate:({path: 'cast.castID', model: Person, select:'name img'})})
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get all the slugs to use getStaticProps
router.get("/get-slugs", async (req, res) => {
  try {
    let slugs = await MovieInfo.find({}).select('slug')
    return res.status(200).json(slugs);
  } catch (error) {
    return res.status(500).json(error);
  }
});


module.exports = router