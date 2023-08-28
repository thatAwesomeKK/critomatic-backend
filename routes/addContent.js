const express = require("express");
const router = express.Router();
const Person = require('../models/person')
const { cloudinary } = require('../cloudinary')
const Movie = require('../models/movie')


//Adding the Movies
router.post("/", async (req, res) => {
  const castID = []
  const stillsData = []
  let bgImg = ''
  let titlePoster = ''
  try {
    const { title, titleposter, stills, bgimg, director, cast, rating, userrating, genre, summary, boxoffice, ottplatform, duration } = req.body

    let foundDirector = await Person.findOne({ name: director })

    for (let index = 0; index < cast.length; index++) {
      const element = cast[index];
      let foundCast = await Person.findOne({ name: element.name })
      castID.push({ _id: foundCast._id, playing: element.playing });
    }


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