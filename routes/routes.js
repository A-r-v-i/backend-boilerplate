const express = require("express");
const router = express.Router();
const tokenizer = require("../middlewares/tokenizer");

const authControl = require("../controllers/authControllers");
const postControl = require("../controllers/postControllers");

router.post("/login", authControl.login);
router.post("/signup", authControl.signUp);
router.get("/user", tokenizer, authControl.getUserDetails);
router.get("/posts", tokenizer, postControl.getPosts);
router.post("/post", tokenizer, postControl.postData);
module.exports = router;
