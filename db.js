const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.DATABASE_URL;

const connectToMongo = async () => {
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection Succesfull");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectToMongo;
