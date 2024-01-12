const express = require('express')
const router = express.Router();
const transaction = require("../controllers/transactionControllers");
const {isAuthenticated} = require("../middlewares/auth");

router.post('/create', isAuthenticated, transaction.createTransaction);

router.delete('/delete/:transactionId', isAuthenticated, transaction.deleteTransaction);

router.get('/viewall', isAuthenticated, transaction.viewAllTransactions); 

router.get('/:transactionId', isAuthenticated, transaction.viewTransactionDetail); 

router.put('/update/:transactionId', isAuthenticated, transaction.updateTransaction);

module.exports = router;