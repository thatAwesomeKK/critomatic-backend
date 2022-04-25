const express = require("express");
const router = express.Router();
const Person = require('../models/person')

router.post("/add-director", async (req, res) => {
    try {
      const { name, dob, img, desc } = req.body
      let director = new Person({
        name,dob,img,desc
      })
      let savedDirector = await director.save()
      return res.status(200).json(savedDirector);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
  
router.post("/add-cast", async (req, res) => {
    try {
      const { name, dob, img, desc } = req.body
      let cast = new Person({
        name, dob, img, desc
      })
      let savedCast = await cast.save()
      return res.status(200).json(savedCast);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

module.exports = router  