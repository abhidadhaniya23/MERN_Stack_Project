const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar/lib/gravatar");

// @route : POST => api/users
// @desc : register user
// @access : public

router.post("/", [check("name", "Name is required").not().isEmpty(), check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })], async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors });
  }

  const { name, email, password } = req.body;

  try {
    // [x] check if user exist or not
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ errors: [{ msg: "User is already exist." }] });
    }

    // [x] Get user gravatar
    let avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // [x] Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log(user);

    // [x] Return JSON Web Token (JWT)
    // JWT Basically used for access protected routes
    const payLoad = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payLoad, config.get("JWT_Secret"), { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      // console.log(token);
      res.json({ token: token, msg: "User Registered" });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
