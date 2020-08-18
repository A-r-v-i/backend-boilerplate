const express = require("express");
const router = express.Router();
const tokenizer = require("../middlewares/tokenizer");

const authControl = require("../controllers/controllers");

router.post("/login", authControl.login);
router.post("/signup", authControl.signUp);
router.get("/posts", tokenizer, authControl.getPosts);
router.post("/post", tokenizer, authControl.postData);
module.exports = router;
