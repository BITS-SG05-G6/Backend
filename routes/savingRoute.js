const express = require('express')
const router = express.Router();
const savingGoal = require('../controllers/savingController');
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, savingGoal.createGoal);

router.get("/view", isAuthenticated, savingGoal.viewGoals);

router.get("/view/:id", isAuthenticated, savingGoal.viewGoal);

router.delete("/:id/delete", isAuthenticated, savingGoal.deleteGoal);

router.put("/:id/update", isAuthenticated, savingGoal.updateGoal);


module.exports = router;