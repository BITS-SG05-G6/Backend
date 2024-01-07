const express = require('express')
const router = express.Router();
const statisticDetail = require("../controllers/statisticDetail");
const {isAuthenticated} = require("../middlewares/auth");

router.get('/category/7days/:categoryId/:userId/:currencyType', statisticDetail.getCategoryStatistics7days);
router.get('/category/thismonth/:categoryId/:userId/:currencyType', statisticDetail.getCategoryStatisticsThisMonth);
router.get('/category/lastmonth/:categoryId/:userId/:currencyType', statisticDetail.getCategoryStatisticsLastMonth);

module.exports = router;