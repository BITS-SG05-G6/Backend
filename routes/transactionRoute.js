const express = require('express')
const router = express.Router();
const transaction = require("../controllers/transactionControllers");


router.post('/create', transaction.createTransaction);

router.delete('/delete/:userId/:transactionId', transaction.deleteTransaction);

router.get('/viewall/:userId', transaction.viewAllTransactions); 

router.get('/:userId/:transactionId', transaction.viewTransactionDetail); 

router.put('/update/:userId/:transactionId', transaction.updateTransaction);

module.exports = router;