const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route : GET => api/auth
// @desc : test Route
// @access : protected

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.msg);
    res.status(500).send("Server Error");
  }
  res.send("Auth Route");
});

// @route : POST => api/auth
// @desc : authenticate user & get token
// @access : public

router.post("/", [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").isLength({ min: 6 })], async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // [!] match password with founded user
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payLoad = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payLoad, config.get("JWT_Secret"), { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      // console.log(token);
      res.json({ token: token, msg: "You are logged In" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
