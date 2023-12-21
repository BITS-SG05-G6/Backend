const express = require("express");
const router = express.Router();
const user = require("../controllers/userControllers")
const {isAuthenticated} = require("../middlewares/auth");

// Signup route
router.post("/signup", user.signup);

// Login route
router.post("/signin", user.signin);

router.get("/profile", isAuthenticated, user.getProfile);

module.exports = router;
