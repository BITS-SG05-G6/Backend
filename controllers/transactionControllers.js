const Transaction = require('../models/transaction');
const ErrorHandler = require('../utils/ErrorHandler');

exports.createTransaction = async (req, res, next) => {
  const { description, amount, transactionType, walletId } = req?.body;

  if (!description) {
    return next(new ErrorHandler('Description is required', 400));
  }

  if (!amount) {
    return next(new ErrorHandler('Amount is required', 400));
  }

  if (!transactionType) {
    return next(new ErrorHandler('Transaction type is required', 400));
  }

  if (!walletId) {
    return next(new ErrorHandler('Wallet ID is required', 400));
  }

  try {
    const transactionData = {
      description,
      amount,
      transactionType,
      wallet: walletId
    };

    const createdTransaction = await Transaction.create(transactionData);
    res.status(200).json({ message: 'Transaction created successfully!', transaction: createdTransaction });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.deleteTransaction = async (req, res, next) => {
  const { transactionId } = req.params; 

  try {
    const transaction = await Transaction.findById(transactionId);
    console.log(transactionId);
    if (!transaction) {
      return next(new ErrorHandler('Transaction not found', 404));
    }

    await Transaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: 'Transaction deleted successfully!' });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// //View all transaction

// exports.viewAllTransactions = async (req, res, next) => {
//   try {
//     const allTransactions = await Transaction.find();
//     res.status(200).json({ transactions: allTransactions });
//   } catch (err) {
//     next(new ErrorHandler(err.message, 500));
//   }
// };

// //View transaction by ID


// exports.viewTransactionsByWalletId = async (req, res, next) => {
//   const { walletId } = req.params;

//   try {
//     const transactions = await Transaction.find({ wallet: walletId });
//     console.log(walletId);
//     if (transactions.length === 0) {
//       return next(new ErrorHandler('No transactions found for this wallet ID', 404));
//     }

//     res.status(200).json({ transactions });
//   } catch (err) {
//     next(new ErrorHandler(err.message, 500));
//   }
// };
