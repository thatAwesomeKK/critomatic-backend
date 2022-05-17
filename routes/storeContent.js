const express = require("express");
const router = express.Router();
const axios = require('axios').default;
const schedule = require('node-schedule');
const fetch = require("node-fetch");
const apiKey = process.env.TMDB_API_KEY
const slugify = require('slugify')
const Movie = require('../models/movie')
const Person = require('../models/person');
const genres = require("../methods/genre");
const Rating = require('../models/rating')
const Show = require('../models/show');
const ShowInfo = require("../models/showInfo");

const job = schedule.scheduleJob('0 0 * * THU', async () => {
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`

  let movieResponse = await axios(url)
  let movieJson = await movieResponse.data;

  movieJson.results.forEach(async (movie) => {
    let movieID = await Movie.findOne({ title: movie.title })
    if (!movieID && movie.backdrop_path) {
      let creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`

      let slug = await slugify(movie.title, {
        lower: true
      })

      let creditsResponse = await axios(creditsUrl)
      let creditsJson = await creditsResponse.data;

      let castID = []
      for (let i = 0; i < 5; i++) {
        const element = await creditsJson.cast[i];
        let cast = await Person.findOne({ name: element?.name })
        if (!cast) {
          let person = new Person({
            name: element?.name,
            img: element?.profile_path
          })
          let savedCast = await person.save()
          castID.push({ castID: savedCast._id, playing: element?.character })
        } else {
          castID.push({ castID: cast._id, playing: element?.character })
        }
      }

      let crewID = []
      for (let i = 0; i < creditsJson.crew.length; i++) {
        const element = await creditsJson.crew[i];
        let crew = await Person.findOne({ name: element?.name })
        if (!crew) {
          if (element?.job === 'Director' || element?.job === 'Writer' || element?.job === 'Director of Photography') {
            let person = new Person({
              name: element?.name,
              img: element?.profile_path
            })
            let savedCrew = await person.save()
            crewID.push({ crewID: savedCrew._id, job: element?.job })
          }
        } else {
          if (element?.department === 'Writing' || element?.department === 'Directing' || element?.department === 'Visual Effects') {
            crewID.push({ crewID: crew._id, job: element?.job })
          }
        }
      }
      for (let i = 0; i < movie.genre_ids.length; i++) {
        for (let j = 0; j < genres.length; j++) {
          const elemental = movie.genre_ids[i];
          const element = genres[j];
          if (elemental === element.id) {
            movie.genre_ids[i] = element?.name
          }
        }
      }



      let clipsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`

      let clipsResponse = await axios(clipsUrl)
      let clipsJson = await clipsResponse.data;
      let clips = []
      if (clipsJson) {
        for (let i = 0; i < clipsJson.results.length; i++) {
          const element = await clipsJson.results[i];
          let vidLink = 'https://www.youtube.com/watch?v=' + element.key
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
      console.log(savedMovie);
    }
  })
  return
});


const job2 = schedule.scheduleJob('0 0 * * THU', async () => {
  let url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`

  let showResponse = await fetch(url, {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    }
  })
  let showJson = await showResponse.json();

  showJson.results.forEach(async (show) => {
    let showID = await Show.findOne({ title: show.name || show.original_name })
    if (!showID && show.backdrop_path) {
      let creditsUrl = `https://api.themoviedb.org/3/tv/${show.id}/aggregate_credits?api_key=${apiKey}&language=en-US`

      let creditsResponse = await fetch(creditsUrl, {
        method: "GET",
        header: {
          "Content-Type": "application/json",
        }
      })
      let creditsJson = await creditsResponse.json()

      let castID = []
      for (let i = 0; i < 5; i++) {
        const element = await creditsJson.cast[i];
        if (!element) {
          continue
        }
        let name = element.original_name || element.name
        let cast = await Person.findOne({ name: name })
        if (!cast) {
          let person = new Person({
            name: name,
            img: element.profile_path
          })
          let savedCast = await person.save()
          castID.push({ castID: savedCast._id, playing: element.character })
        } else {
          castID.push({ castID: cast._id, playing: element.character })
        }
      }

      let crewID = []
      for (let i = 0; i < creditsJson.crew.length; i++) {
        const element = await creditsJson.crew[i];
        if (!element) {
          continue
        }
        let name = element.name || element.original_name
        let crew = await Person.findOne({ name: name })
        if (!crew) {
          if (element.department === 'Writing' || element.department === 'Directing' || element.department === 'Visual Effects') {
            let person = new Person({
              name: name,
              img: element.profile_path
            })
            let savedCrew = await person.save()
            crewID.push({ crewID: savedCrew._id, job: element.job })
          }
        } else {
          if (element.department === 'Writing' || element.department === 'Directing' || element.department === 'Visual Effects') {
            crewID.push({ crewID: crew._id, job: element.job })
          }
        }
      }
      for (let i = 0; i < show.genre_ids.length; i++) {
        for (let j = 0; j < genres.length; j++) {
          const elemental = show.genre_ids[i];
          const element = genres[j];
          if (elemental === element.id) {
            show.genre_ids[i] = element.name
          }
        }
      }

      let clipsUrl = `https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=${apiKey}&language=en-US`

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
          let vidLink = 'https://www.youtube.com/watch?v=' + element.key
          await clips.push(vidLink)
        }
      }

      let saveShow = new Show({
        title: show.title || show.original_name,
        titleposter: show.poster_path,
        bgimg: show.backdrop_path,
        genre: show.genre_ids,
        crew: crewID,
        cast: castID,
        summary: show.overview,
        AirDate: show.first_air_date,
        video: clips
      })
      let savedShow = await saveShow.save()
      console.log(savedShow);
    }
  })
  return
});


router.put("/movie-info", async (req, res) => {
  try {
    const { movieName, boxoffice, platform, duration, adminRating, adminReview, approved } = req.body

    let foundMovie = await Movie.findOne({ title: movieName })

    if (!foundMovie) {
      return res.status(500).json({ error: 'Movie Not Found' });
    }

    const newMovie = {}
    if (boxoffice) { newMovie.boxoffice = boxoffice }
    if (platform) { newMovie.platform = platform }
    if (duration) { newMovie.duration = duration }
    if (adminRating && adminReview) { newMovie.adminRating = { rating: adminRating, review: adminReview } }
    if (approved) { newMovie.approved = approved }

    let updatedMovie = await Movie.findByIdAndUpdate(foundMovie._id, { $set: newMovie }, { new: true })
    return res.status(200).json(updatedMovie);
  } catch (error) {
    return res.status(500).json(error);
  }
});



router.post("/show-info", async (req, res) => {
  try {
    const { showName, platform, episodeNo, name, rate, review } = req.body
    console.log(req.body);

    let foundShow = await Show.findOne({ title: showName }).select('_id')

    if (!foundShow) {
      return res.status(500).json({ error: 'Movie Not Found' });
    }

    let slug = await slugify(showName, {
      lower: true
    })

    let show = new ShowInfo({
      showID: foundShow._id,
      slug: slug + episodeNo,
      platform,
      episode: { number: episodeNo, name: name },
      adminRating: { rate: rate, review: review }
    })

    let savedShow = await show.save()
    return res.status(200).json(savedShow);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server Error");
  }
});

module.exports = router 