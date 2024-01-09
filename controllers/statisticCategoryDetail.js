const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const NormalTransaction = require("../models/normalTransaction");

//Category income/expense in last 7 days
exports.getCategoryStatistics7days = async (req, res, next) => {
  const user = req.userID;
  const { categoryId } = req.params;
  console.log("category id",categoryId)
  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);

  try {
    const baseCurrency = req.userID.baseCurrency;
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago

    const transactionsPerCategoryAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          category: objectIdCategoryId,
          date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
          type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerCategoryAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10); // Extract date in 'YYYY-MM-DD' format

      if (!totalsByDate[date]) {
        totalsByDate[date] = { expense: 0, income: 0 };
      }

      if (entry.type === 'Expense') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].expense += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].expense += entry.USD;
        }
      } else if (entry.type === 'Income') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].income += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].income += entry.USD;
        }
      }
    });

    res.status(200).json({
      message: 'Success',
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};



exports.getCategoryStatisticsThisMonth = async (req, res, next) => {
  const user = req.userID;
  const { categoryId } = req.params;
  const baseCurrency = req.userID.baseCurrency;

  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);

  try {
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month

    const transactionsPerCategoryAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          category: objectIdCategoryId,
          date: { $gte: startOfCurrentMonth, $lte: today }, // Filter for transactions within the current month
          type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerCategoryAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10); // Extract date in 'YYYY-MM-DD' format

      if (!totalsByDate[date]) {
        totalsByDate[date] = { expense: 0, income: 0 };
      }

      if (entry.type === 'Expense') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].expense += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].expense += entry.USD;
        }
      } else if (entry.type === 'Income') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].income += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].income += entry.USD;
        }
      }
    });

    res.status(200).json({
      message: 'Success',
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


exports.getCategoryStatisticsLastMonth = async (req, res, next) => {
  const user = req.userID;
  const { categoryId } = req.params;
  const baseCurrency = req.userID.baseCurrency;

  const objectIdUserId = new mongoose.Types.ObjectId(user);
  const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);

  try {
    const today = new Date();
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the last month

    const transactionsPerCategoryAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          category: objectIdCategoryId,
          date: {
            $gte: startOfLastMonth,
            $lt: startOfCurrentMonth, // Filter for transactions up to the last day of the last month
          },
          type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
        },
      },
    ]);

    const totalsByDate = {};

    transactionsPerCategoryAndDate.forEach((entry) => {
      const date = entry.date.toISOString().slice(0, 10); // Extract date in 'YYYY-MM-DD' format

      if (!totalsByDate[date]) {
        totalsByDate[date] = { expense: 0, income: 0 };
      }

      if (entry.type === 'Expense') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].expense += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].expense += entry.USD;
        }
      } else if (entry.type === 'Income') {
        if (baseCurrency === 'VND' && entry.VND) {
          totalsByDate[date].income += entry.VND;
        } else if (baseCurrency === 'USD' && entry.USD) {
          totalsByDate[date].income += entry.USD;
        }
      }
    });

    res.status(200).json({
      message: 'Success',
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

