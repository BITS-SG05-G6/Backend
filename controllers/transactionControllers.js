const Category = require("../models/category");
const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require('mongoose'); 
const Wallet = require("../models/wallet");

// Create transaction
exports.createTransaction = async (req, res, next) => {
  const category =
    req?.body?.category === "none" || req?.body?.category === undefined
      ? null
      : req?.body?.category;
  const wallet =
    req?.body?.wallet === "none" || req?.body?.wallet === undefined
      ? null
      : req?.body?.wallet;
  const transactionData = {
    description: req?.body?.description,
    amount: req?.body?.amount,
    transactionType: req?.body?.transactionType,
    wallet: wallet,
    user: req.userID,
    category: category,
    date: req?.body?.date,
    type: req?.body?.type,
    title: req?.body?.title,
    currency: req?.body?.currency,
    saving: req?.body?.saving,
    createdAt: new Date(Date.now())
  };

  try {
    if (transactionData.transactionType == "Normal") {
      const createdTransaction = await NormalTransaction.create(
        transactionData
      );
      res.status(200).json({
        message: "Transaction created successfully!",
        transaction: createdTransaction,
      });
    } else {
      return next(
        new ErrorHandler("Invalid type of transaction (Normal or Bill)!", 400)
      );
    }
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  const { transactionId } = req.params;

  try {
    if (!transactionId) {
      return next(new ErrorHandler("Transaction ID are required", 400));
    }

    await NormalTransaction.findByIdAndDelete(transactionId).catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });
    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// View all transaction or filter by date
exports.viewAllTransactions = async (req, res, next) => {
  const filter = {
    date: req?.query?.date,
    user: req.userID,
  };


  try {
    console.log(filter.date);
    if (filter.date === undefined || filter.date === null) {
      delete filter.date;
    }
    
    if (filter.date) {
      const parsedDate = new Date(filter.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new ErrorHandler("Invalid date format", 400));
      }

      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    const normalTransactions = await NormalTransaction.find(filter).catch(
      () => {
        return next(new ErrorHandler("Transactions not found", 404));
      }
    );


    if (normalTransactions.length == 0) {
      return res.status(200).json({ transactions: null });
    }

    const transactionList = await Promise.all(
      normalTransactions.map(async (transaction) => {
        const category = await Category.findById(transaction.category);
        let categoryName;
        let categoryColor;
        if (category) {
          categoryName = category.name;
          categoryColor = category.color;
        } else {
          categoryName = null;
          categoryColor = null;
        }
        return {
          _id: transaction._id,
          title: transaction.title,
          category: categoryName,
          amount: transaction.amount,
          color: categoryColor,
          type: transaction.type,
          currency: transaction.currency,
          createdAt: transaction.createdAt,
          date: transaction.date
        };
      })
    );

    // Sort transactions based on created date (descending order)
    transactionList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ transactions: transactionList });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// View a transaction
exports.viewTransactionDetail = async (req, res, next) => {
  const { transactionId } = req.params;
  // console.log(transactionId);
  try {
    if (transactionId === "undefined") {
      return res.status(200).json("");

    } else {
      const normalTransaction = await NormalTransaction.findById(
        req.params.transactionId
      ).catch(() => {
        // return res.status(200).json({transaction: null});
        return next(new ErrorHandler("Transaction not found", 404));
      });

      if (!normalTransaction) {
        return next(new ErrorHandler("Transaction not found", 404));
      }
      let categoryName;
      let categoryColor;
      let walletName;
      let walletColor;
      if (normalTransaction.category) {
        const category = await Category.findById(
          normalTransaction.category
        ).catch(() => {
          return next(new ErrorHandler("Category not found", 404));
        });
        categoryName = category.name;
        categoryColor = category.color;
      } else {
        categoryName = null;
        categoryColor = null;
      }

      if (normalTransaction.wallet) {
        const wallet = await Wallet.findById(normalTransaction.wallet).catch(
          () => {
            return next(new ErrorHandler("Wallet not found", 404));
          }
        );


        walletName = wallet.name;
        walletColor = wallet.color;
      } else {
        walletName = null;
        walletColor = null;
      }

      const transaction = {
        _id: normalTransaction._id,
        type: normalTransaction.type,
        title: normalTransaction.title,
        date: normalTransaction.date,
        description: normalTransaction.description,
        amount: normalTransaction.amount,
        category: categoryName,
        categoryColor: categoryColor,
        wallet: walletName,
        walletColor: walletColor,
        currency: normalTransaction.currency
      };
      return res.status(200).json(transaction);
    }
  } catch (err) {
    // console.error("Error:", err);
    next(new ErrorHandler(err.message, 500));
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  const { userId, transactionId } = req.params;
  const { amount, type, description, title } = req?.body;

  try {
    if (!transactionId || !userId) {
      return next(
        new ErrorHandler("Transaction ID and User ID are required", 400)
      );
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!normalTransaction) {
      return next(
        new ErrorHandler("Transaction not found for this User ID", 404)
      );
    }

    // Update the transaction fields
    normalTransaction.amount = amount || normalTransaction.amount;
    normalTransaction.description =
      description || normalTransaction.description;
    normalTransaction.type = type || normalTransaction.type;
    normalTransaction.title = title || normalTransaction.title;


    // Save the updated transact`xx``on

    await normalTransaction.save();

    res.status(200).json({
      message: "Transaction updated successfully!",
      normalTransaction,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
