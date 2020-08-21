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
  let user = await User.findById(id);
  if (user) {
    await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) {
        console.log(err);
        res.sendStatus(403).json({
          message: "unauthorized",
        });
      } else {
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
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    res.json({
      message: "Unauthorized user, Login to continue.",
    });
  }
};

exports.postComment = async (req, res, next) => {
  const postId = req.params.postId,
    userId = req.body.userId,
    content = req.body.content;
  let post = await Confession.findById(postId);
  if (post) {
    await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) {
        res.json({ message: "Unauthorized user access" });
      } else {
        post.comments.push({
          content: content,
          userId: userId,
        });
        post.save();
        res.json({
          post: post,
          message: "comments posted successfully",
        });
      }
    });
  } else {
    res.json({
      message: "Post doesn't exist!",
    });
  }
};

exports.deleteConfession = async (req, res, next) => {
  const postId = req.body.postId,
    userId = req.body.userId;
  console.log(userId, postId);
  await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (!err) {
      let confessions = Confession.find();
      console.log(confessions);
      Confession.findById(postId).then((confession) => {
        if (confession.userId == userId) {
          // confessions = confessions.filter((item) => item._id != postId);
          confession.save();
          res.json({
            message: "Deleted success",
          });
        } else {
          res.json({
            message: "Unauthorized event occured.",
          });
        }
      });
      //   if (confession.userId === userId) {
      //     console.log("found");
      //     confessions = confessions.filter((item) => item._id !== postId);
      //     confessions.save();
      //     res.json({
      //       message: "Post deleted successfully",
      //     });
      //   } else {
      //   res.json({
      //     message: "Unauthorized",
      //   });
      // }
    } else {
      res.json({
        message: "Unauthorized access",
      });
    }
  });
};
