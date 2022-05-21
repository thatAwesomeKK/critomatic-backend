const express = require("express");
const router = express.Router();
const Slider = require('../models/homeslider')
const Movie = require('../models/movie')
const Person = require('../models/person')
const Rating = require("../models/rating");
const Show = require("../models/show");

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
    let movie = await Movie.find({approved: true}).select('title slug bgimg duration releaseDate summary'); 
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-shows", async (req, res) => {
  try {
    let show = await Show.find({approved: true}).select('title slug bgimg AirDate summary'); 
    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/movie-update", async (req, res) => {
  let movieID = req.body.contentID
  try {
    let movie = await Movie.findById({_id: movieID}).select('title boxoffice platform duration adminRating approved'); 
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/show-update", async (req, res) => {
  let showID = req.body.contentID
  try {
    let show = await Show.findById({_id: showID}).select('title platform duration episodes adminRating approved'); 
    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get Single Movie with the Slug
router.get("/get-movie", async (req, res) => {
  try {
    let movie = await Movie.findOne({ slug: req.query.slug }).populate({path: 'crew.crewID', model: Person, select:'name img'}).populate({path: 'cast.castID', model: Person, select:'name img'})
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-show", async (req, res) => {
  try {
    let show = await Show.findOne({ slug: req.query.slug }).populate({path: 'crew.crewID', model: Person, select:'name img'}).populate({path: 'cast.castID', model: Person, select:'name img'})
    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get all the slugs to use getStaticProps
router.get("/get-slugs-movie", async (req, res) => {
  try {
    let slugs = await Movie.find({approved: true}).select('slug')
    return res.status(200).json(slugs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-slugs-show", async (req, res) => {
  try {
    let slugs = await Show.find({approved: true}).select('slug')
    return res.status(200).json(slugs);
  } catch (error) {
    return res.status(500).json(error);
  }
});


module.exports = router