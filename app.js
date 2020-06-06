const express = require("express");
const app = express();
const colors = require("colors");
const mongoose = require("mongoose");

require("dotenv").config();
app.use(express.json());

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("DB Connected");
};

app.listen(5000, () => {
  console.log("\tListening on port 5000!!".green);
  connectDB();
});
