const express = require("express");
const router = express.Router();

// @route : GET => api/post
// @desc : test Route
// @access : public

router.get("/", (req, res) => {
  res.send("Post Route");
});

module.exports = router;
