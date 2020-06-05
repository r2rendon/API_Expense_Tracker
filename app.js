const express = require("express");
const app = express();
const colors = require("colors");

app.listen(5000, () => {
  console.log("\tListening on port 5000!!".green);
});
