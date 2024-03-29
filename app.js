require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema =new mongoose.Schema({
email: String,
password: String,
});

// const secret = "this-is-secret";

userSchema.plugin(encrypt, {secret: process.env.SECRCT,encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
extended: true
}));

app.get("/", function (req, res) {
res.render("home");
});

app.get("/login", function (req, res) {
res.render("login");
});

app.get("/register", function (req, res) {
res.render("register");
});

app.post("/register", function (req, res) {
const newUser = new User({
email: req.body.username,
password: req.body.password,
});

newUser.save()
.then(function () {
res.render("secrets");
})
.catch(function (err) {
console.log(err);
});
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({ email: username })
    .then(foundUser => {
    if (foundUser && foundUser.password === password) {
    res.render("secrets");
    } else {
    res.send("Invalid username or password");
    }
    })
    .catch(err => {
    console.log(err);
    res.status(500).send("An error occurred");
    });
    });
    
    
    
    app.listen(3000, function () {
    console.log("Server started on port 3000.");
    });