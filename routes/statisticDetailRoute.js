const express = require('express')
const router = express.Router();
const statisticCategoryDetail = require("../controllers/statisticCategoryDetail");
const {isAuthenticated} = require("../middlewares/auth");
const statisticWalletDetail = require("../controllers/statisticWalletDetail")
const statisticSavingGoal = require("../controllers/savingGoalStatisticController")
router.get('/category/week/:categoryId',isAuthenticated, statisticCategoryDetail.getCategoryStatistics7days);
router.get('/category/thismonth/:categoryId',isAuthenticated, statisticCategoryDetail.getCategoryStatisticsThisMonth);
router.get('/category/lastmonth/:categoryId',isAuthenticated, statisticCategoryDetail.getCategoryStatisticsLastMonth);


//Wallet
router.get('/wallet/week/:walletID',isAuthenticated, statisticWalletDetail.getWalletStatistics7days);
router.get('/wallet/thismonth/:walletID',isAuthenticated, statisticWalletDetail.getWalletStatisticsThisMonth);
router.get('/wallet/lastmonth/:walletID',isAuthenticated, statisticWalletDetail.getWalletStatisticsLastMonth);

//Saving goal
router.get('/savinggoal/:savingID',isAuthenticated, statisticSavingGoal.getTotalAndTargetByDate);
router.get('/savinggoal/thismonth/:savingID',isAuthenticated, statisticSavingGoal.getThisMonthSaving);
router.get('/savinggoal/lastmonth/:savingID',isAuthenticated, statisticSavingGoal.getLastMonthSaving);
router.get('/totalsaving',isAuthenticated, statisticSavingGoal.getTotalMonthlySaving);

module.exports = router;        