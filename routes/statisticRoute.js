const express = require('express')
const router = express.Router();
const statistic = require("../controllers/statisticControllers");
const {isAuthenticated} = require("../middlewares/auth");
router.get('/last7days/:userId', statistic.getTransactionStatistics7days);
router.get('/lastmonth/:userId', statistic.getTransactionStatisticsLastMonth);
router.get('/frequencydistribution/:userId', statistic.expensesFrequencyDistribution);
router.get('/compareexpanseincomebymonth/:userId', statistic.getCompareExpanseIncomeByMonth);
module.exports = router;