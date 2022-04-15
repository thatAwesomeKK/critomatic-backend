const express = require("express");
const router = express.Router();
const { cloudinary } = require('../cloudinary')

router.post("/", async (req, res) => {
  try {
    let file = await req.files.files;
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      if (err) {
        return res.json({ error })
      }
      return res.status(200).json(result.secure_url);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/getform", async (req, res) => {
  console.log(req.body.data);
  let file = `data:image/png;base64,${req.body.data}`
  cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      return res.json({ err })
    }
    return res.status(200).json(result.secure_url);
  });
  // return res.status(200).json("hello");
});

module.exports = router