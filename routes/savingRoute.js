const express = require('express')
const router = express.Router();
const savingGoal = require('../controllers/savingController');
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, savingGoal.createGoal);

router.get("/view", isAuthenticated, savingGoal.viewGoals);

router.get("/view/:id", isAuthenticated, savingGoal.viewGoal);

router.delete("/delete/:id", isAuthenticated, savingGoal.deleteGoal);


module.exports = router;