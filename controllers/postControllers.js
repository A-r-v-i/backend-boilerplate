const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Confession = require("../models/Confession");
const User = require("../models/User");

exports.getPosts = (req, res, next) => {
  Confession.find()
    .populate("userId", ["_id", "name"])
    .then((posts) => {
      // console.log(posts);
      res.json({
        confessions: posts,
      });
    });
};

exports.getUserPost = (req, res, next) => {
  const id = req.params.userId;
  Confession.find()
    .populate("userId", ["name", "email", "confessions"])
    .then((posts) => {
      const itemFromUser = posts.filter((post) => {
        console.log(post.userId._id, id);
        return post.userId._id == id;
      });
      console.log(itemFromUser);
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
            // console.log(post);
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
    content = req.body.content,
    /**
     * optionable, only for editing the comments
     */
    edit = req.query.edit,
    commentId = req.body.commentId;
  // console.log(content, userId, postId);
  let post = await Confession.findById(postId);
  if (post) {
    await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) {
        res.json({ message: "Unauthorized user access" });
      } else {
        if (edit) {
          // console.log(edit, commentId, userId);
          let comment = post.comments.find(
            (_post) => _post._id == commentId && _post.userId == userId
          );
          if (comment) {
            comment.content = content;
            console.log(comment);
            post.save();
            res.json({
              post: post.comments,
              message: "comments edited successfully",
            });
          } else {
            console.log("user mismatched");
            res.json({
              message: "Unauthorized action.",
            });
          }
        } else {
          post.comments.push({
            content: content,
            userId: userId,
          });
          post.save();
          res.json({
            post: post.comments,
            message: "comments posted successfully",
          });
        }
      }
    });
  } else {
    res.json({
      message: "Post doesn't exist!",
    });
  }
};

exports.likePost = async (req, res, next) => {
  const postId = req.params.postId,
    userId = req.body.userId,
    liked = req.body.liked;
  console.log(liked);
  let arr = [];
  await Confession.findById(postId).then((post) => {
    if (!post) {
      res.json({
        message: "Post doesn't exist",
      });
    } else if (liked) {
      post.likes.push(userId);
      post.save();
      res.json({
        message: "Success",
      });
    } else {
      arr = post.likes.filter((user) => {
        user._id != userId;
      });
      // console.log(arr);
      post.likes = arr;
      post.save();
      res.json({
        message: "disliked",
      });
    }
  });
};

exports.deleteConfession = async (req, res, next) => {
  const postId = req.body.postId,
    userId = req.body.userId;
  // console.log(userId, postId);
  await jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (!err) {
      Confession.findOneAndDelete({
        _id: postId,
        userId: userId,
      })
        .then((result) => {
          console.log(result);
          if (!result) {
            res.status(404).json({
              message: "No such post exists.",
            });
          } else {
            // console.log("Deleted: ", result);
            res.status(200).json({
              message: "Post deleted successfully",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({
            message: "Post not found for the user",
          });
        });
    } else {
      res.json({
        message: "Unauthorized access",
      });
    }
  });
};
