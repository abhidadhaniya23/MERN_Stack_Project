const express = require("express");
const router = express.Router();

// @route : GET => api/profile
// @desc : test Route
// @access : public

router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
