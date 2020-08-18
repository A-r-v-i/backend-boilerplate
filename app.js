require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const uri = require("./helper/db");

const fileUpload = require("./fileUpload");

/**
 * Routes
 */
const mainRoutes = require("./routes/routes");

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let arr = ["sample", "test", "RIP"];

// CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/event", (req, res, next) => {
  console.log(req.body);
});
//fileupload route
app.use("/api", fileUpload);

//socket connection
io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.on("getInitialData", () => io.emit("dataFromApi", arr));

  socket.broadcast.emit("welcome", "Hi, welcome to sample customer chat!");

  /**
   * If any msg from client comes in.
   */
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

  /**
   * Broadcasting the msg to all the connection
   */
  socket.on("broadcast-to-all", (msg) => {
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

app.use("/api", mainRoutes);

//PORT listening
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("DB connected..");
    http.listen(port, () => {
      console.log(`Server launched on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
