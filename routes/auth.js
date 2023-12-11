const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../controllers/userControllers")
// const errorHandler = require("../middlewares/errorHandler");

// Use the error handling middleware
// router.use(errorHandler);

// Signup route
router.post("/signup", user.signup);

// Login route
router.post("/signin", user.signin);

module.exports = router;
