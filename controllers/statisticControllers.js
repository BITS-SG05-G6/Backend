const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require('mongoose'); 

exports.getTransactionStatistics7days = async (req, res, next) => {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
    try {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago
  
      const totalExpensePerDay = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
            type: 'Expense'
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalExpense: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);
  
      const totalIncomePerDay = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
            type: 'Income'
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalIncome: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);
  
      const totalsByDay = {};
      totalExpensePerDay.forEach((entry) => {
        const date = entry._id;
        totalsByDay[date] = {
          expense: entry.totalExpense || 0,
          income: 0
        };
      });
  
      totalIncomePerDay.forEach((entry) => {
        const date = entry._id;
        if (totalsByDay[date]) {
          totalsByDay[date].income = entry.totalIncome || 0;
        } else {
          totalsByDay[date] = {
            income: entry.totalIncome || 0,
            expense: 0
          };
        }
      });
  
      res.status(200).json({
        message: "Success",
        totalsByDay
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  exports.getTransactionStatisticsLastMonth = async (req, res, next) => {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
    try {
      const today = new Date();
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28); // Get the date four weeks ago
  
      const totalExpensePerWeek = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: fourWeeksAgo, $lte: today }, // Filter for transactions within the last 4 weeks
            type: 'Expense'
          }
        },
        {
          $group: {
            _id: { $week: { $toDate: "$date" } }, // Grouping by week
            totalExpense: { $sum: { $toDouble: "$amount" } } // Calculate total expense for each week
          }
        }
      ]);
  
      const totalIncomePerWeek = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: fourWeeksAgo, $lte: today }, // Filter for transactions within the last 4 weeks
            type: 'Income'
          }
        },
        {
          $group: {
            _id: { $week: { $toDate: "$date" } }, // Grouping by week
            totalIncome: { $sum: { $toDouble: "$amount" } } // Calculate total income for each week
          }
        }
      ]);
  
      const totalsByWeek = {};
  
      totalExpensePerWeek.forEach((entry) => {
        const weekNumber = entry._id;
        totalsByWeek[`Week ${weekNumber}`] = {
          expense: entry.totalExpense || 0,
          income: 0
        };
      });
      
      totalIncomePerWeek.forEach((entry) => {
        const weekNumber = entry._id;
        if (totalsByWeek[`Week ${weekNumber}`]) {
          totalsByWeek[`Week ${weekNumber}`].income = entry.totalIncome || 0;
        } else {
          totalsByWeek[`Week ${weekNumber}`] = {
            income: entry.totalIncome || 0,
            expense: 0
          };
        }
      });
  
      res.status(200).json({
        message: "Success",
        totalsByWeek
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  


  exports.expensesFrequencyDistribution = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
      const distribution = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            type: 'Expense'
          }
        },
        {
          $group: {
            _id: null,
            '<1000': {
              $sum: {
                $cond: [{ $lte: [{ $toDouble: '$amount' }, 1000] }, 1, 0]
              }
            },
            '1000-2000': {
              $sum: {
                $cond: [{ $and: [{ $gt: [{ $toDouble: '$amount' }, 1000] }, { $lte: [{ $toDouble: '$amount' }, 2000] }] }, 1, 0]
              }
            },
            '2000-5000': {
              $sum: {
                $cond: [{ $and: [{ $gt: [{ $toDouble: '$amount' }, 2000] }, { $lte: [{ $toDouble: '$amount' }, 5000] }] }, 1, 0]
              }
            },
            '>5000': {
              $sum: {
                $cond: [{ $gt: [{ $toDouble: '$amount' }, 5000] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            '<1000': '$<1000',
            '1000-2000': '$1000-2000',
            '2000-5000': '$2000-5000',
            '>5000': '$>5000'
          }
        }
      ]);
  
      if (distribution.length === 0) {
        return res.status(200).json({
          message: 'Success',
          distribution: {
            '<1000': 0,
            '1000-2000': 0,
            '2000-5000': 0,
            '>5000': 0
          }
        });
      }
  
      res.status(200).json({
        message: 'Success',
        distribution: distribution[0]
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  
  exports.getCompareExpanseIncomeByMonth = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of the current month
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Get the last day of the current month
  
      const totalExpensePerMonth = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter for transactions within the current month
            type: 'Expense'
          }
        },
        {
          $group: {
            _id: null,
            totalExpense: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);
  
      const totalIncomePerMonth = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter for transactions within the current month
            type: 'Income'
          }
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);
  
      const totalExpense = totalExpensePerMonth.length > 0 ? totalExpensePerMonth[0].totalExpense : 0;
      const totalIncome = totalIncomePerMonth.length > 0 ? totalIncomePerMonth[0].totalIncome : 0;
      const responseData = {
        "Expense": totalExpense,
        "Income": totalIncome
      };
      res.status(200).json({

        "Expense":totalExpense,
        "Income":totalIncome
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  
  
  
  
