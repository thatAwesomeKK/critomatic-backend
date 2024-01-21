const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.DATABASE_URL;

const connectToMongo = async () => {
  mongoose.set('strictQuery', false);
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
      ssl: true,
    })
    .then(() => {
      console.log("Connection Succesfull");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectToMongo;
