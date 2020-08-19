const Confession = require("../models/Confession");
const jwt = require("jsonwebtoken"),
  secret = "panjumittaiyaeee1234masteraNNanuKuaeOreaOOthapp1oemm98";

exports.getPosts = (req, res, next) => {
  Confession.find((post) => {
    console.log(post);
  });
};

exports.postData = (req, res, next) => {
  const data = req.body;
  // console.log(data);
  if (data) {
    jwt.verify(req.token, secret, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403).json({
          message: "unauthorized",
        });
      } else {
        const { user, iat } = authData;
        const { _id, name } = user;
        // console.log(_id, name, iat);
        res.json({
          message: "Success",
          _id,
          name,
          iat,
        });
      }
    });
  }
};
