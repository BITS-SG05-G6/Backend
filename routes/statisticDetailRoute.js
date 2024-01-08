const express = require('express')
const router = express.Router();
const statisticCategoryDetail = require("../controllers/statisticCategoryDetail");
const {isAuthenticated} = require("../middlewares/auth");
const statisticWalletDetail = require("../controllers/statisticWalletDetail")
router.get('/category/week/:categoryId/:currencyType',isAuthenticated, statisticCategoryDetail.getCategoryStatistics7days);
router.get('/category/thismonth/:categoryId/:currencyType',isAuthenticated, statisticCategoryDetail.getCategoryStatisticsThisMonth);
router.get('/category/lastmonth/:categoryId/:currencyType',isAuthenticated, statisticCategoryDetail.getCategoryStatisticsLastMonth);


//Wallet
router.get('/wallet/week/:walletID/:currencyType',isAuthenticated, statisticWalletDetail.getWalletStatistics7days);

module.exports = router;        