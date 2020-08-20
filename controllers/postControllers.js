const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Confession = require("../models/Confession");
const User = require("../models/User");

exports.getPosts = (req, res, next) => {
  Confession.find().then((posts) => {
    res.json({
      confessions: posts,
    });
  });
};

exports.getUserPost = (req, res, next) => {
  const id = req.params.userId;
  Confession.find().then((posts) => {
    const itemFromUser = posts.filter((post) => {
      return post.userId == id;
    });
    // console.log(itemFromUser);
    res.json({
      items: itemFromUser,
    });
  });
};

exports.postData = async (req, res, next) => {
  const title = req.body.title,
    content = req.body.content,
    id = req.body.userId;
  // console.log(req.body);
  // console.log(id, mongoose.Types.ObjectId.isValid(id));
  if (id) {
    await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403).json({
          message: "unauthorized",
        });
      } else {
        User.findById(id)
          .then((user) => {
            console.log(user);
            Confession.create({
              title: title,
              content: content,
              userId: user,
            })
              .then((post) => {
                console.log(post);
                user.confessions.push(post);
                user.save();
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
  } else {
    res.json({
      message: "Unauthorized user, Login to continue.",
    });
  }
};
