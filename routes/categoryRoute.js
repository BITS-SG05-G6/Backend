const express = require("express");
const router = express.Router();
const category = require("../controllers/categoryControllers");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, category.createCategory);

router.get("/view", isAuthenticated, category.viewCategories);

router.get("/view/:id", isAuthenticated, category.viewCategory);

router.put("/update/:id", isAuthenticated, category.updateCategory);

router.delete("/delete/:id", isAuthenticated, category.deleteCategory);

module.exports = router;
