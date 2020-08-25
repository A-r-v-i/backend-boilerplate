const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log(req.headers);
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403).json({
      message: "Login timed out",
    });
  }
};
