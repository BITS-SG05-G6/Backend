const express = require('express')
const router = express.Router();
const statistic = require("../controllers/statisticControllers");
const {isAuthenticated} = require("../middlewares/auth");

//Chart1: Trend Statistic
router.get('/trend/week/:userId', statistic.getTransactionStatistics7days);

router.get('/trend/thismonth/:userId', statistic.getTransactionStatisticsThisMonth);

router.get('/trend/lastmonth/:userId', statistic.getTransactionStatisticsLastMonth);

//Chart 2: Distribution Data
router.get('/distribution/total/:userId', statistic.expensesFrequencyDistribution);

router.get('/distribution/week/:userId', statistic.expensesFrequencyDistributionLastWeek);

router.get('/distribution/month/:userId', statistic.expensesFrequencyDistributionLastMonth);

//Chart 3: Category Income
router.get('/catin/total/:userId', statistic.getTotalIncomeByCategory);

router.get('/catin/lastweek/:userId', statistic.getTotalIncomeByCategoryLastWeek);

router.get('/catin/lastmonth/:userId', statistic.getTotalIncomeByCategoryLastMonth);


//Chart 4: Category Expense
router.get('/catex/total/:userId', statistic.getTotalExpenseByCategory);

router.get('/catex/lastweek/:userId', statistic.getTotalExpenseByCategoryLastWeek);

router.get('/catex/lastmonth/:userId', statistic.getTotalExpenseByCategoryLastMonth);

//Chart 5: Income/Expense Ratio
router.get('/exin/month/:userId', statistic.getCompareExpanseIncomeByMonth);

router.get('/exin/week/:userId', statistic.getCompareExpanseIncomeByWeek);

router.get('/exin/total/:userId', statistic.getCompareExpanseIncomeTotal);

//Chart 6: Wallet
router.get('/walletex/week/:userId', statistic.getTotalExpenseByWalletLastWeek);

router.get('/walletex/month/:userId', statistic.getTotalExpenseByWalletLastMonth);

router.get('/walletex/total/:userId', statistic.getTotalExpenseByWallet);

module.exports = router;