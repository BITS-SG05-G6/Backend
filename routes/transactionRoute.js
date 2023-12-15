const express = require('express')
const router = express.Router();
const transaction = require("../controllers/transactionControllers");
const {isAuthenticated} = require("../middlewares/auth");

router.post('/create', isAuthenticated, transaction.createTransaction);

router.delete('/delete/:userId/:transactionId', transaction.deleteTransaction);

router.get('/viewall', isAuthenticated, transaction.viewAllTransactions); 

router.get('/:transactionId', isAuthenticated, transaction.viewTransactionDetail); 

router.put('/update/:userId/:transactionId', transaction.updateTransaction);

module.exports = router;