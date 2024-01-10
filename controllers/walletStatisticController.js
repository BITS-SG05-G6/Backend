const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");


//Chart: Expense by Wallet
exports.getTotalExpenseByWallet = async (req, res, next) => {
  try {
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

    const expenseByWallet = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
        },
      },
      {
        $lookup: {
          from: "wallets", // Your wallets collection name
          localField: "wallet",
          foreignField: "_id",
          as: "walletData",
        },
      },
      {
        $unwind: "$walletData",
      },
      {
        $group: {
          _id: "$walletData.name",
          totalExpense: { $sum: `$${currencyField}` },
          numberOfExpenses: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          walletName: "$_id",
          totalExpense: "$totalExpense",
          // numberOfExpenses: '$numberOfExpenses'
        },
      },
    ]);

    res.status(200).json({
      expenseByWallet,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

  
exports.getTotalExpenseByWalletLastWeek = async (req, res, next) => {
  try {
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 6
    );

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

    const expenseByWallet = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $lookup: {
          from: "wallets", // Your wallets collection name
          localField: "wallet",
          foreignField: "_id",
          as: "walletData",
        },
      },
      {
        $unwind: "$walletData",
      },
      {
        $group: {
          _id: "$walletData.name",
          totalExpense: { $sum: `$${currencyField}` },
          numberOfExpenses: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          walletName: "$_id",
          totalExpense: "$totalExpense",
          // numberOfExpenses: '$numberOfExpenses'
        },
      },
    ]);

    res.status(200).json({
      expenseByWallet,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getTotalExpenseByWalletLastMonth = async (req, res, next) => {
  try {
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the previous month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

    const expenseByWallet = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: lastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $lookup: {
          from: "wallets", // Your wallets collection name
          localField: "wallet",
          foreignField: "_id",
          as: "walletData",
        },
      },
      {
        $unwind: "$walletData",
      },
      {
        $group: {
          _id: "$walletData.name",
          totalExpense: { $sum: `$${currencyField}` },
          numberOfExpenses: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          walletName: "$_id",
          totalExpense: "$totalExpense",
          // numberOfExpenses: '$numberOfExpenses'
        },
      },
    ]);

    res.status(200).json({
      expenseByWallet,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

  