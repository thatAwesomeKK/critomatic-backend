const express = require("express");
const router = express.Router();
const schedule = require('node-schedule');
const fetch = require("node-fetch");
const apiKey = process.env.TMDB_API_KEY
const slugify = require('slugify')
const Movie = require('../models/movie')
const Person = require('../models/person');
const genres = require("../genre");
const MovieInfo = require('../models/movieInfo')
const Rating = require('../models/rating')

const job = schedule.scheduleJob('0 0 * * THU', async () => {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`

  let movieResponse = await fetch(url, {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    }
  })
  let movieJson = await movieResponse.json();

  movieJson.results.forEach(async (movie) => {
    let movieID = await Movie.findOne({ title: movie.title })
    if (movieID || !movie.backdrop_path) { } else {
      let slug = await slugify(movie.title || movie.original_name, {
        lower: true
      })

      let creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`

      let creditsResponse = await fetch(creditsUrl, {
        method: "GET",
        header: {
          "Content-Type": "application/json",
        }
      })
      let creditsJson = await creditsResponse.json();

      let castID = []
      for (let i = 0; i < 5; i++) {
        const element = await creditsJson.cast[i];
        let cast = await Person.findOne({ name: element.name })
        if (cast) { } else {
          let person = new Person({
            name: element.name,
            img: element.profile_path
          })
          let savedCast = await person.save()
          castID.push({ castID: savedCast._id, playing: element.character })
        }
      }

      let crewID = []
      for (let i = 0; i < creditsJson.crew.length; i++) {
        const element = await creditsJson.crew[i];
        let crew = await Person.findOne({ name: element.name })
        if (crew) { } else {
          if (element.job === 'Director' || element.job === 'Writer' || element.job === 'Director of Photography') {
            let person = new Person({
              name: element.name,
              img: element.profile_path
            })
            let savedCrew = await person.save()
            crewID.push({ crewID: savedCrew._id, job: element.job })
          }
        }
      }
      for (let i = 0; i < movie.genre_ids.length; i++) {
        for (let j = 0; j < genres.length; j++) {
          const elemental = movie.genre_ids[i];
          const element = genres[j];
          if (elemental === element.id) {
            movie.genre_ids[i] = element.name
          }
        }
      }

      let clipsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`

      let clipsResponse = await fetch(clipsUrl, {
        method: "GET",
        header: {
          "Content-Type": "application/json",
        }
      })
      let clipsJson = await clipsResponse.json();
      let clips = []
      if (clipsJson) {
        for (let i = 0; i < clipsJson.results.length; i++) {
          const element = await clipsJson.results[i];
          let vidLink = 'https://www.youtube.com/watch?v='+element.key
          await clips.push(vidLink)
        }
      }

      let saveMovie = new Movie({
        slug,
        title: movie.title || movie.original_name,
        titleposter: movie.poster_path,
        bgimg: movie.backdrop_path,
        genre: movie.genre_ids,
        crew: crewID,
        cast: castID,
        summary: movie.overview,
        releaseDate: movie.release_date,
        video: clips
      })
      let savedMovie = await saveMovie.save()
    }
  })
  return
});




router.post("/", async (req, res) => {
  try {
    const { movieName, boxoffice, platform, duration } = req.body

    let foundMovie = await Movie.findOne({ title: movieName }).select('_id')

    let foundRating = await Rating.findOne({movieID: foundMovie._id}).select('_id')

    if(!foundMovie){
      return res.status(500).json({error: 'Movie Not Found'});
    }

    let slug = await slugify(movieName, {
      lower: true
    })

    let movie = new MovieInfo({
      movieID: foundMovie._id,
      slug,
      boxoffice,
      platform,
      duration,
      rating: foundRating._id,
    })
    let savedMovie = await movie.save()
    return res.status(200).json(savedMovie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/add-rating", async (req, res) => {
  try {
    const { movieName, rating, userRating } = req.body

    let foundMovie = await Movie.findOne({ title: movieName }).select('_id')

    if(!foundMovie){
      return res.status(500).json({error: 'Movie Not Found'});
    }

    let saveRating = new Rating({
      movieID: foundMovie._id,
      rating,
      userrating: userRating,
    })
    let savedRating = await saveRating.save()
    return res.status(200).json(savedRating);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router 