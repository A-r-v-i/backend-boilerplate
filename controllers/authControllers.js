const fs = require("fs");
const User = require("../models/User");
const jwt = require("jsonwebtoken"),
  secret = "panjumittaiyaeee1234masteraNNanuKuaeOreaOOthapp1oemm98";

exports.signUp = (req, res, next) => {
  console.log(req.body);
  const name = req.body.username,
    email = req.body.email,
    password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        User.create({
          name: name,
          email: email,
          password: password,
        }).then((result) => {
          console.log(result);
          res.json({
            message: "User created",
          });
        });
      } else {
        res.status(409).json({
          message: "User already exists",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email,
    password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.sendStatus(400).json({
          message: "User not found, Kindly Signup for further process",
        });
      }
      if (user.password !== password) {
        res.json({
          message: "Password Incorrect",
        });
      } else {
        // console.log(user);
        const _user = {
          email: email,
          password: password,
          username: user.name,
        };
        jwt.sign({ _user }, secret, { expiresIn: "24h" }, (err, token) => {
          res.json({
            id: user._id,
            message: "Logged in",
            loggedIn: true,
            token,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "User not found",
      });
    });
};

exports.getUserDetails = (req, res, next) => {
  console.log(req.body.id);
  const id = req.body.id;
  if (id) {
    User.findById(id)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
