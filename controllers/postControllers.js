const mongoose = require("mongoose");
const Confession = require("../models/Confession");
const User = require("../models/User");
const jwt = require("jsonwebtoken"),
  secret = "panjumittaiyaeee1234masteraNNanuKuaeOreaOOthapp1oemm98";

exports.getPosts = (req, res, next) => {
  // console.log(req);
  Confession.find((post) => {
    console.log(post);
    if (post.length == 0) {
      res.json({
        message: "No more post available",
      });
    }
  });
};

exports.postData = async (req, res, next) => {
  console.log(req.body);
  const title = req.body.title,
    content = req.body.content,
    id = req.body.userId;
  console.log(id, mongoose.Types.ObjectId.isValid(id));
  if (id) {
    await jwt.verify(req.token, secret, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403).json({
          message: "unauthorized",
        });
      } else {
        // const { _user, iat } = authData;
        // const { _id, name } = user;
        User.findById(id)
          .then((user) => {
            console.log(user);
            Confession.create({
              title: title,
              content: content,
              userId: user,
            })
              .then((result) => {
                console.log(result);
                res.json({
                  message: "Success",
                  // _id,
                  // name,
                  // iat,
                  // authData,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log("user not found");
          });

        // console.log(authData);
      }
    });
  }
};
