const express = require("express");
const router = express.Router();
const user = require("../controllers/userControllers");
const { isAuthenticated } = require("../middlewares/auth");

// Signup route
router.post("/signup", user.signup);

// Login route
router.post("/signin", user.signin);

router.post("/signout", user.signout);

router.get("/profile", isAuthenticated, user.getProfile);

// Update Profile
router.put("/updateprofile", isAuthenticated, user.updateProfile);

module.exports = router;
