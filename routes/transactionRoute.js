const express = require('express')
const router = express.Router();
const transaction = require("../controllers/transactionControllers");

router.post('/createtransaction', transaction.createTransaction);
router.post('/deletetransaction/:transactionId', transaction.deleteTransaction);
// router.get('/viewalltransactions', transaction.viewAllTransactions);
// router.post('/viewtransaction/:walletId', transaction.viewTransactionsByWalletId);



module.exports = router;