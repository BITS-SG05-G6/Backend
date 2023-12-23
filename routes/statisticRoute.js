const express = require('express')
const router = express.Router();
const statistic = require("../controllers/statisticControllers");
const {isAuthenticated} = require("../middlewares/auth");

//Chart1: Trend Statistic
router.get('/chart1/week/:userId', statistic.getTransactionStatistics7days);

router.get('/chart1/thismonth/:userId', statistic.getTransactionStatisticsThisMonth);

router.get('/chart1/lastmonth/:userId', statistic.getTransactionStatisticsLastMonth);

//Chart 2: Distribution Data
router.get('/chart2/total/:userId', statistic.expensesFrequencyDistribution);

router.get('/chart2/week/:userId', statistic.expensesFrequencyDistributionLastWeek);

router.get('/chart2/month/:userId', statistic.expensesFrequencyDistributionLastMonth);

//Chart 3: Category Income
router.get('/chart3/total/:userId', statistic.getTotalIncomeByCategory);

router.get('/chart3/lastweek/:userId', statistic.getTotalIncomeByCategoryLastWeek);

router.get('/chart3/lastmonth/:userId', statistic.getTotalIncomeByCategoryLastMonth);


//Chart 4: Category Expense
router.get('/chart4/total/:userId', statistic.getTotalExpenseByCategory);

router.get('/chart4/lastweek/:userId', statistic.getTotalExpenseByCategoryLastWeek);

router.get('/chart4/lastmonth/:userId', statistic.getTotalExpenseByCategoryLastMonth);

//Chart 5: Income/Expense Ratio
router.get('/chart5/month/:userId', statistic.getCompareExpanseIncomeByMonth);

router.get('/chart5/week/:userId', statistic.getCompareExpanseIncomeByWeek);

router.get('/chart5/total/:userId', statistic.getCompareExpanseIncomeTotal);

//Chart 6: Wallet
router.get('/chart6/week/:userId', statistic.getTotalExpenseByWalletLastWeek);

router.get('/chart6/month/:userId', statistic.getTotalExpenseByWalletLastMonth);

router.get('/chart6/total/:userId', statistic.getTotalExpenseByWallet);

module.exports = router;