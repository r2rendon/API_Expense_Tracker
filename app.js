const express = require("express");
const app = express();
const colors = require("colors");
const mongoose = require("mongoose");

require("dotenv").config();
app.use(express.json());

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  fName: String,
  lName: String,
});

const transactionsSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  userId: String,
});

const user = mongoose.model("user", usersSchema);
const transaction = mongoose.model("transaction", transactionsSchema);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("\t˜DB Connected".green);
};

//Get users
app.get("/users", async (req, res) => {
  await user.find({}, (err, users) => {
    if (err) res.json({ err: err });
    else res.json(users);
  });
});

//Get USER
app.get("/user/:userID", async (req, res) => {
  await user.findById(req.params.userID, (err, user) => {
    if (err) res.json({ err: err });
    else res.json(user);
  });
});

//Post users
app.post("/user", async (req, res) => {
  const newUser = new user(req.body);
  let response = true;
  newUser.save((err, mRes) => {
    if (err) response = false;
  });

  res.json({ response: response });
});

//Get Transactions
app.get("/transactions", async (req, res) => {
  await transaction.find({}, (err, transactions) => {
    if (err) res.json({ err: err });
    else res.json(transactions);
  });
});

//Post Transactions
app.post("/transaction", async (req, res) => {
  const newTransaction = new transaction(req.body);
  let response = true;
  newTransaction.save((err, mRes) => {
    if (err) response = false;
  });

  res.json({ response: response });
});

app.listen(5000, () => {
  console.log("\tListening on port 5000!!".green);
  connectDB();
});
