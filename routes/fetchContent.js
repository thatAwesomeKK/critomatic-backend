const express = require("express");
const router = express.Router();
const Slider = require('../models/homeslider')
const Movie = require('../models/movie')
const Director = require('../models/director')
const Cast = require('../models/cast')
const slugify = require('slugify')


router.get("/get-slider-image", async (req, res) => {
  try {
    let news = await Slider.find({});
    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-movies", async (req, res) => {
  try {
    let movie = await Movie.find({}).select('slug title summary bgimg rating');
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-movie", async (req, res) => {
  try {
    let movie = await Movie.findOne({slug: req.query.slug})
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-director", async (req, res) => {
  try {
    let directorName = await Director.findOne({_id: req.query.director})
    return res.status(200).json(directorName);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-actor", async (req, res) => {
  try {
    let actorName = await Cast.findOne({_id: req.query.actor})
    return res.status(200).json(actorName);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/add-movies", async (req, res) => {
  const castID = []
  try {
    const { title, titleposter, stills, bgimg, director, cast, rating, userrating, genre, summary, boxoffice, ottplatform, duration } = req.body

    let foundDirector = await Director.findOne({name: director})

    for (let index = 0; index < cast.length; index++) {
      const element = cast[index];
      let foundCast = await Cast.findOne({name: element})
      castID.push(foundCast._id);
    }

    let slug = await slugify(title, {
      lower: true 
    })

    let movie = new Movie({
      slug,
      title,
      titleposter,
      stills,
      bgimg,
      director: foundDirector._id,
      cast: castID,
      rating,
      userrating,
      genre,
      summary,
      boxoffice,
      ottplatform,
      duration,
    })
    let savedMovie = await movie.save()
    return res.status(200).json(savedMovie);
  } catch (error) {
    return res.status(500).json(error);
  }
});



module.exports = router