const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.getWalletStatistics7days = async (req, res, next) => {
  const user = req.userID;
  const { walletID } = req.params;
  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdWalletId = new mongoose.Types.ObjectId(walletID);

  try {
    const baseCurrency = req.userID.baseCurrency;
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago

    const transactionsPerWalletAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          wallet: objectIdWalletId,
          date: { $gte: oneWeekAgo, $lte: today },
          type: { $in: ["Expense", "Income"] },
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerWalletAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10); // Extract date in 'YYYY-MM-DD' format
      if (!totalsByDate[date]) {
        totalsByDate[date] = { Expense: 0, Income: 0 };
      }

      if (entry.type === "Expense") {
        totalsByDate[date].Expense += entry[baseCurrency] || 0;
      } else if (entry.type === "Income") {
        totalsByDate[date].Income += entry[baseCurrency] || 0;
      }
    });

    res.status(200).json({
      message: "Success",
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getWalletStatisticsThisMonth = async (req, res, next) => {
  const user = req.userID;
  const { walletID } = req.params;
  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdWalletId = new mongoose.Types.ObjectId(walletID);

  try {
    const baseCurrency = req.userID.baseCurrency;
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const transactionsPerWalletAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          wallet: objectIdWalletId,
          date: { $gte: startOfCurrentMonth, $lte: today },
          type: { $in: ["Expense", "Income"] },
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerWalletAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10);
      if (!totalsByDate[date]) {
        totalsByDate[date] = { Expense: 0, Income: 0 };
      }

      if (entry.type === "Expense") {
        totalsByDate[date].Expense += entry[baseCurrency] || 0;
      } else if (entry.type === "Income") {
        totalsByDate[date].Income += entry[baseCurrency] || 0;
      }
    });

    res.status(200).json({
      message: "Success",
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


exports.getWalletStatisticsLastMonth = async (req, res, next) => {
  const user = req.userID;
  const { walletID } = req.params;
  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdWalletId = new mongoose.Types.ObjectId(walletID);

  try {
    const baseCurrency = req.userID.baseCurrency;
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const transactionsPerWalletAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          wallet: objectIdWalletId,
          date: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
          type: { $in: ["Expense", "Income"] },
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerWalletAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10);
      if (!totalsByDate[date]) {
        totalsByDate[date] = { Expense: 0, Income: 0 };
      }

      if (entry.type === "Expense") {
        totalsByDate[date].Expense += entry[baseCurrency] || 0;
      } else if (entry.type === "Income") {
        totalsByDate[date].Income += entry[baseCurrency] || 0;
      }
    });

    res.status(200).json({
      message: "Success",
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


  