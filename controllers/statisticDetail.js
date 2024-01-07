const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.getCategoryStatistics7days = async (req, res, next) => {
    const { userId, categoryId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdCategoryId = new mongoose.Types.ObjectId(categoryId);
  
    try {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago
  
      const totalExpensePerDay = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            category: objectIdCategoryId,
            createdAt: { $gte: oneWeekAgo, $lte: today },
            transactionType: 'Normal',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalExpense: { $sum: { $cond: [{ $eq: ['$transactionType', 'Expense'] }, '$amount', 0] } },
            totalIncome: { $sum: { $cond: [{ $eq: ['$transactionType', 'Income'] }, '$amount', 0] } },
          },
        },
      ]);
  
      const totalsByDay = {};
      totalExpensePerDay.forEach((entry) => {
        const date = entry._id;
        totalsByDay[date] = {
          expense: entry.totalExpense || 0,
          income: entry.totalIncome || 0,
        };
      });
  
      res.status(200).json({
        message: 'Success',
        totalsByDay,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };