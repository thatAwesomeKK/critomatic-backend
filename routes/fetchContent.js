const express = require("express");
const router = express.Router();
const Slider = require('../models/homeslider')
const Movie = require('../models/movie')
const Director = require('../models/director')
const Cast = require('../models/cast')
const slugify = require('slugify')
const { cloudinary } = require('../cloudinary')


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
    let movie = await Movie.findOne({ slug: req.query.slug }).populate('director').populate('cast')
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/add-movies", async (req, res) => {
  const castID = []
  const stillsData = []
  let bgImg = ''
  let titlePoster = ''
  try {
    const { title, titleposter, stills, bgimg, director, cast, rating, userrating, genre, summary, boxoffice, ottplatform, duration } = req.body

    let foundDirector = await Director.findOne({ name: director })

    console.log(cast);
    for (let index = 0; index < cast.length; index++) {
      const element = cast[index];
      let foundCast = await Cast.findOne({ name: element })
      castID.push(foundCast._id);
    }


    let slug = await slugify(title, {
      lower: true
    })


    await cloudinary.uploader.upload(titleposter, (err, result) => {
      if (err) {
        console.log(error);
      }
      console.log();
      titlePoster = result.secure_url
    });

    await cloudinary.uploader.upload(bgimg, (err, result) => {
      if (err) {
        console.log(error);
      }
      console.log();
      bgImg = result.secure_url
    });



    for (let index = 0; index < stills.length; index++) {
      const element = stills[index];
      await cloudinary.uploader.upload(element, (err, result) => {
        if (err) {
          console.log(error);
        }
        stillsData.push(result.secure_url);
      });
    }


    let movie = new Movie({
      slug,
      title,
      titleposter: titlePoster,
      stills: stillsData,
      bgimg: bgImg,
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