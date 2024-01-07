const express = require('express')
const router = express.Router();
const statisticDetail = require("../controllers/statisticDetail");
const {isAuthenticated} = require("../middlewares/auth");

router.get('/category/7days/:categoryId/:userId', statisticDetail.getCategoryStatistics7days);

module.exports = router;