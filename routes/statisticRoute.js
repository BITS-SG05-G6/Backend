const express = require('express')
const router = express.Router();
const transactionStatistic = require('../controllers/transactionStatisticController');
const incomeStatistic = require('../controllers/incomeStatisticControllers');
const expenseStatistic = require('../controllers/expenseStatisticController');
const walletStatistic = require('../controllers/walletStatisticController');
const compareStatistic = require('../controllers/compareStatisticController');
const { isAuthenticated } = require("../middlewares/auth");

//Chart1: Trend Statistic
router.get('/trend/week', isAuthenticated, transactionStatistic.getTransactionStatistics7days);

router.get('/trend/thismonth', isAuthenticated, transactionStatistic.getTransactionStatisticsThisMonth);

router.get('/trend/lastmonth', isAuthenticated, transactionStatistic.getTransactionStatisticsLastMonth);

//Chart 2: Distribution Data
router.get('/distribution/total', isAuthenticated, expenseStatistic.expensesFrequencyDistribution);

router.get('/distribution/week', isAuthenticated, expenseStatistic.expensesFrequencyDistributionLastWeek);

router.get('/distribution/month', isAuthenticated, expenseStatistic.expensesFrequencyDistributionLastMonth);

//Chart 3: Category Income
router.get('/catin/total', isAuthenticated, incomeStatistic.getTotalIncomeByCategory);

router.get('/catin/lastweek', isAuthenticated, incomeStatistic.getTotalIncomeByCategoryLastWeek);

router.get('/catin/lastmonth', isAuthenticated, incomeStatistic.getTotalIncomeByCategoryLastMonth);


//Chart 4: Category Expense
router.get('/catex/total', isAuthenticated, expenseStatistic.getTotalExpenseByCategory);

router.get('/catex/lastweek', isAuthenticated, expenseStatistic.getTotalExpenseByCategoryLastWeek);

router.get('/catex/lastmonth', isAuthenticated, expenseStatistic.getTotalExpenseByCategoryLastMonth);

//Chart 5: Income/Expense Ratio
router.get('/exin/month', isAuthenticated, compareStatistic.getCompareExpanseIncomeByMonth);

router.get('/exin/week', isAuthenticated, compareStatistic.getCompareExpanseIncomeByWeek);

router.get('/exin/total', isAuthenticated, compareStatistic.getCompareExpanseIncomeTotal);

//Chart 6: Wallet
router.get('/walletex/week', isAuthenticated, walletStatistic.getTotalExpenseByWalletLastWeek);

router.get('/walletex/month', isAuthenticated, walletStatistic.getTotalExpenseByWalletLastMonth);

router.get('/walletex/total', isAuthenticated, walletStatistic.getTotalExpenseByWallet);

module.exports = router;