const express = require("express");
const router = express.Router();
/**
 * Middleware for checking token in request
 */
const tokenizer = require("../middlewares/tokenizer");

/**
 * Controllers
 */
const authControl = require("../controllers/authControllers");
const postControl = require("../controllers/postControllers");

/**
 * Routes for authentication and user details
 */
router.post("/login", authControl.login);
router.post("/signup", authControl.signUp);
router.get("/user", tokenizer, authControl.getUserDetails);

/**
 * Routes for confession posts
 */
router.get("/posts", tokenizer, postControl.getPosts);
router.post("/post", tokenizer, postControl.postData);
router.get("/posts/:userId", tokenizer, postControl.getUserPost);
router.post("/post/:postId", tokenizer, postControl.postComment);
router.delete("/post", tokenizer, postControl.deleteConfession);

module.exports = router;
