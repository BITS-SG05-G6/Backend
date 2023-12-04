const express = require('express')
const router = express.Router();
const transaction = require("../controllers/transactionControllers");

router.post('/createtransaction', transaction.createTransaction);
router.post('/deletetransaction/:userId/:transactionId', transaction.deleteTransaction);
router.get('/viewalltransactions/:userId', transaction.viewAllTransactions); 
router.get('/viewatransaction/:userId/:transactionId', transaction.viewTransactions); //Date http://localhost:4000/api/transaction/viewtransactions/656da7668a456e1316715911?startDate=2023-12-01&endDate=2023-12-03
router.post('/updatetransaction/:userId/:transactionId', transaction.updateTransaction);





module.exports = router;