const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // [ ] Get the token from the header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token authorized denied" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get("JWT_Secret"));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
