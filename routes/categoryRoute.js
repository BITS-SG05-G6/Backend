const express = require('express')
const router = express.Router();
const category = require("../controllers/categoryControllers");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, category.createCategory)

router.get("/view/:type", isAuthenticated, category.viewCategory)

router.delete("/delete/:id", isAuthenticated, category.deleteCategory)

module.exports = router;