const express = require("express"),
  router = express.Router(),
  aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "z+iEt3ENTDGHvW7/7tG+82mD+94kGKOLcB4ME7KL",
  accessKeyId: "AKIAI6P2MXTVYSODJIEA",
  region: "ap-south-1",
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "food-easy-images",
    // bucket: process.env.AWS_BUC_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "staticimages" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.get("/file", (req, res, next) => {
  res.json({
    msg: "Success for get",
  });
});

router.post("/add-file", upload.single("image"), function (req, res) {
  // const file = req.file;
  // console.log(file);
  return res.json({
    imgUrl: req.file.location,
    msg: "donno",
  });
});

module.exports = router;
