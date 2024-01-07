const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const NormalTransaction = require("../models/normalTransaction");

//Category income/expense in last 7 days
exports.getCategoryStatistics7days = async (req, res, next) => {
  const { userId, categoryId, currencyType } = req.params;
  const objectIdUserId = new mongoose.Types.ObjectId(userId);
  const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);

  try {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago

    const expensePerCategoryAndDate = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          category: objectIdCategoryId,
          date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
          type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
          currency: currencyType === "USD" ? "USD" : "VND", // Filter by currency type
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type",
          },
          totalAmount: { $sum: { $toDouble: "$amount" } },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0],
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ]);

    const totalsByDate = {};
    expensePerCategoryAndDate.forEach((entry) => {
      const date = entry._id;
      totalsByDate[date] = {
        expense: entry.expense || 0,
        income: entry.income || 0,
      };
    });

    res.status(200).json({
      message: "Success",
      totalsByDate,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
exports.getCategoryStatisticsThisMonth = async (req, res, next) => {
    const { userId, categoryId, currencyType } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);
  
    try {
      const today = new Date();
      const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month
  
      const expensePerCategoryAndDate = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            category: objectIdCategoryId,
            date: {
              $gte: startOfCurrentMonth,
              $lte: today, // Filter for transactions up to today's date
            },
            type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
            currency: currencyType === "USD" ? "USD" : "VND", // Filter by currency type
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              type: "$type",
            },
            totalAmount: { $sum: { $toDouble: "$amount" } },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            expense: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0],
              },
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0],
              },
            },
          },
        },
      ]);
  
      const totalsByDate = {};
      expensePerCategoryAndDate.forEach((entry) => {
        const date = entry._id;
        totalsByDate[date] = {
          expense: entry.expense || 0,
          income: entry.income || 0,
        };
      });
  
      res.status(200).json({
        message: "Success",
        totalsByDate,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };

  exports.getCategoryStatisticsLastMonth = async (req, res, next) => {
    const { userId, categoryId, currencyType } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);
  
    try {
      const today = new Date();
      const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the last month
  
      const expensePerCategoryAndDate = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            category: objectIdCategoryId,
            date: {
              $gte: startOfLastMonth,
              $lt: startOfCurrentMonth, // Filter for transactions up to the last day of the last month
            },
            type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
            currency: currencyType === "USD" ? "USD" : "VND", // Filter by currency type
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              type: "$type",
            },
            totalAmount: { $sum: { $toDouble: "$amount" } },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            expense: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0],
              },
            },
            income: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0],
              },
            },
          },
        },
      ]);
  
      const totalsByDate = {};
      expensePerCategoryAndDate.forEach((entry) => {
        const date = entry._id;
        totalsByDate[date] = {
          expense: entry.expense || 0,
          income: entry.income || 0,
        };
      });
  
      res.status(200).json({
        message: "Success",
        totalsByDate,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  
  
  
