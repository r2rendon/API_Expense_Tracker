const express = require("express");
const app = express();
const colors = require("colors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Server Configuration
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.set("useFindAndModify", false);
app.use(cors());

// (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
//     return res.status(200).json({});
//   }
// }

//Schema Definition
const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  fName: String,
  lName: String,
  balance: Number,
});

const transactionsSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  userId: String,
});

//Mongose Modeling
const user = mongoose.model("user", usersSchema);
const transaction = mongoose.model("transaction", transactionsSchema);

//Connection to Mongoose
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("\tDB Connected".green);
};

// ------ R O U T E S ------

//Get users
app.get("/users", async (req, res) => {
  await user.find({}, (err, users) => {
    if (err) res.status(401).json({ err: err });
    else res.status(200).json(users);
  });
});

//Get User by Username
app.get("/user/:username", async (req, res) => {
  await user.find({ username: req.params.username }, (err, user) => {
    if (err) res.status(401).json({ err: err });
    else res.status(200).json(user);
  });
});

//Post users
app.post("/user", async (req, res) => {
  const newUser = new user(req.body);
  let response = true;
  newUser.save((err, mRes) => {
    if (err) response = false;
  });

  res.status(200).json({ response: response });
});

//Get Transactions
app.get("/transactions", async (req, res) => {
  await transaction.find({}, (err, transactions) => {
    if (err) res.status(401).json({ err: err });
    else res.status(200).json(transactions);
  });
});

//GET TRANSACTION
app.get("/transaction/:id", async (req, res) => {
  await transaction.findById(req.params.id, (err, transac) => {
    if (err) res.status(401).json({ err: err });
    else res.status(200).json(transac);
  });
});

//Get transactions by userId
app.get("/transactions/:userId", async (req, res) => {
  await transaction.find({ userId: req.params.userId }, (err, transactions) => {
    if (err) res.status(401).json({ err: err });
    else res.status(200).json(transactions);
  });
});

//Delete Transaction
app.delete("/transactions/:transactionID", async (req, res) => {
  let response = true;
  console.log(req.params.transactionID);
  await transaction.findByIdAndDelete(req.params.transactionID, (err, res) => {
    if (err) response = false;
  });

  res.status(200).json({ response: response });
});

//Post Transaction
app.post("/transaction", async (req, res) => {
  const newTransaction = new transaction(req.body);
  newTransaction.save((err, mRes) => {
    if (err) response = false;
  });

  let actUser, balance;
  await user.findById(req.body.userId, (err, fUser) => {
    actUser = fUser;
  });
  balance = actUser.balance;

  if (balance - balance == 0) balance += newTransaction.amount;
  else balance -= newTransaction.amount;

  user.findByIdAndUpdate(
    req.body.userId,
    { balance: balance },
    (err, updtRes) => {}
  );

  transaction.findById(newTransaction._id, (err, transaction) => {
    res.status(200).json(transaction);
  });
});

//Auth
app.post("/auth", async (req, res) => {
  const user = jwt.verify(req.body.token, process.env.PRIVATE_KEY);
  res.status(200).json(user);
});

//Tokenify
app.post("/auth/tokenify", async (req, res) => {
  const user = jwt.sign(req.body.user, process.env.PRIVATE_KEY);
  res.status(200).json(user);
});

app.listen(5000, () => {
  console.log("\tListening on port 5000!!".green);
  connectDB();
});
