const express = require("express");
const router = express.Router();
const tokenizer = require("../middlewares/tokenizer");

const loginControl = require("../controllers/controllers");

router.post("/login", loginControl.login);
router.get("/posts", tokenizer, loginControl.getPosts);
router.post("/post", tokenizer, loginControl.postData);
module.exports = router;
