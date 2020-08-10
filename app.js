const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const fileUpload = require("./fileUpload");

const port = process.env.PORT || 5000;
let arr = ["sample", "test", "RIP"];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/event", (req, res, next) => {
  console.log(req.body);
});
app.use("/api", fileUpload);

io.on("connection", (socket) => {
  socket.on("getInitialData", () => io.emit("dataFromApi", arr));

  socket.on("dataFromApi", () => {
    console.log("data from api");
    console.log(arr);
    io.emit("dataFromApi", { msg: arr, user: "1" });
  });
  socket.on("toApi", (event) => {
    addEvent(event, (res) => {
      res
        ? io.emit("dataFromApi", {
            msg: arr,
            user: "1",
          })
        : io.emit("error");
    });
  });

  socket.on("broadcast-msg", (msg) => {
    sendMsgs(msg, (res) => {
      res ? io.emit("reply", msg) : io.emit("failed", "I'm boring");
    });
  });
});

const sendMsgs = (msg, cb) => {
  cb(true);
};

const addEvent = (event, cb) => {
  arr.unshift(event);
  cb(true);
};

http.listen(port, () => {
  console.log(`Server launched on ${port}`);
});
