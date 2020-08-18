const fs = require("fs");
const jwt = require("jsonwebtoken"),
  secret = "panjumittaiyaeee1234masteraNNanuKuaeOreaOOthapp1oemm98";

exports.login = (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  if (user.email === "test@gmail.com" && user.password === "testpassword") {
    jwt.sign({ user }, secret, { expiresIn: "30s" }, (err, token) => {
      res.json({
        token,
        message: "login successfull",
      });
    });
  } else {
    res.status(400).json({
      message: "Invalid Credentials",
    });
  }
};

exports.getPosts = (req, res, next) => {
  console.log(req.method);
};

exports.postData = (req, res, next) => {
  console.log(req.body);
  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      console.log(err);
      res.sendStatus(403).json({
        message: "unauthorized",
      });
    } else {
      res.json({ message: "Success", authData });
    }
  });
};
