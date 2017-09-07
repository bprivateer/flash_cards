const express = require("express");
const Model = require("../models/index");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');

const data = {
  id: 1,
  username: "bern",
  password: "password",
  salt: "kjhfjd894",
  favColor: "purple",
  admin: false,
}

router.get("/api/test", function(req, res) {
  res.status(200).json(data);
});

router.get('/api/all', passport.authenticate('basic', {session: false}) ,function (req, res) {

})

module.exports = router;
