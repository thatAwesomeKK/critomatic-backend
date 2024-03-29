const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Person = require("../models/person");
const Show = require("../models/show");

//Get the Slider Image
router.get("/get-slider-image", async (req, res) => {
  let images = [];
  try {
    let movies = await Movie.find({ approved: true }).select("bgimg");
    let shows = await Show.find({ approved: true }).select("bgimg");

    movies.forEach((element) => {
      images.push(`https://image.tmdb.org/t/p/original${element.bgimg}`);
    });

    shows.forEach(async (element) => {
      images.push(`https://image.tmdb.org/t/p/original${element.bgimg}`);
    });

    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-category-image", async (req, res) => {
  let moviePoster = [];
  let showPoster = [];
  try {
    let movies = await Movie.find({ approved: true }).select("titleposter");
    let shows = await Show.find({ approved: true }).select("titleposter");

    movies.forEach((element) => {
      moviePoster.push(`https://image.tmdb.org/t/p/w500${element.titleposter}`);
    });

    shows.forEach(async (element) => {
      showPoster.push(`https://image.tmdb.org/t/p/w500${element.titleposter}`);
    });

    return res.status(200).json({ movie: moviePoster, show: showPoster });
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get All the Movies to be Displayed
router.get("/get-movies", async (req, res) => {
  try {
    let movie = await Movie.find({ approved: true }).select(
      "title slug bgimg duration releaseDate summary"
    );
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get All the Tv Shows to be Displayed
router.get("/get-shows", async (req, res) => {
  try {
    let show = await Show.find({ approved: true }).select(
      "title slug bgimg AirDate summary"
    );
    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get All the Movie Info that need to be Updated
router.post("/movie-update", async (req, res) => {
  let movieID = req.body.contentID;
  try {
    let movie = await Movie.findById({ _id: movieID }).select(
      "title boxoffice platform duration adminRating approved"
    );
    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get all the Tv Show Info that need to Updated
router.post("/show-update", async (req, res) => {
  let showID = req.body.contentID;
  try {
    let show = await Show.findById({ _id: showID }).select(
      "title platform duration episodes adminRating approved"
    );
    return res.status(200).json(show);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get Single Movie with the Slug
router.get("/get-single-content", async (req, res) => {
  try {
    const slug = req.query.slug;
    const contentType = req.query.contentType;

    let finalContent = {};

    if (contentType === "movies") {
      finalContent = await Movie.findOne({ slug })
        .populate({ path: "crew.crewID", model: Person, select: "name img" })
        .populate({ path: "cast.castID", model: Person, select: "name img" });
    } else if (contentType === "shows") {
      finalContent = await Show.findOne({ slug })
        .populate({ path: "crew.crewID", model: Person, select: "name img" })
        .populate({ path: "cast.castID", model: Person, select: "name img" });
    }

    return res.status(200).json(finalContent);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Get all the slugs to use getStaticProps
router.get("/get-slugs", async (req, res) => {
  try {
    let movie = await Movie.find({ approved: true }).select("slug");
    let show = await Show.find({ approved: true }).select("slug");

    const movieSlugs = [];
    const showSlugs = [];

    for (let i = 0; i < movieSlugs.length; i++) {
      movieSlugs[i].newProperty = "movies";
    }

    movie.forEach((element) => {
      const newOb = {
        slug: `movies@${element.slug}`,
        contentType: "movies",
      };
      movieSlugs.push(newOb);
    });

    show.forEach((element) => {
      const newOb = {
        slug: `shows@${element.slug}`,
        contentType: "shows",
      };
      showSlugs.push(newOb);
    });

    return res.status(200).json({ content: [...movieSlugs, ...showSlugs] });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/get-slugs-show", async (req, res) => {
  try {
    let slugs = await Show.find({ approved: true }).select("slug");
    return res.status(200).json(slugs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
