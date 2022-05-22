const router = require("express").Router();
const path = require("path");

router.use("notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

router.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

module.exports = router;
