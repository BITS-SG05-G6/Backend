const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

//Chart 1: Trend statistic
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
          type: "Expense",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalExpense: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalIncomePerDay = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
          type: "Income",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalIncome: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalsByDay = {};
    totalExpensePerDay.forEach((entry) => {
      const date = entry._id;
      totalsByDay[date] = {
        expense: entry.totalExpense || 0,
        income: 0,
      };
    });

    totalIncomePerDay.forEach((entry) => {
      const date = entry._id;
      if (totalsByDay[date]) {
        totalsByDay[date].income = entry.totalIncome || 0;
      } else {
        totalsByDay[date] = {
          income: entry.totalIncome || 0,
          expense: 0,
        };
      }
    });
    res.status(200).json({
      message: "Success",
      totalsByDay,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
exports.getTransactionStatisticsThisMonth = async (req, res, next) => {
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
          type: "Expense",
        },
      },
      {
        $group: {
          _id: { $week: { $toDate: "$date" } }, // Grouping by week
          totalExpense: { $sum: { $toDouble: "$amount" } }, // Calculate total expense for each week
        },
      },
    ]);

    const totalIncomePerWeek = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: fourWeeksAgo, $lte: today }, // Filter for transactions within the last 4 weeks
          type: "Income",
        },
      },
      {
        $group: {
          _id: { $week: { $toDate: "$date" } }, // Grouping by week
          totalIncome: { $sum: { $toDouble: "$amount" } }, // Calculate total income for each week
        },
      },
    ]);

    const totalsByWeek = {};

    totalExpensePerWeek.forEach((entry) => {
      const weekNumber = entry._id;
      totalsByWeek[`Week ${weekNumber}`] = {
        expense: entry.totalExpense || 0,
        income: 0,
      };
    });

    totalIncomePerWeek.forEach((entry) => {
      const weekNumber = entry._id;
      if (totalsByWeek[`Week ${weekNumber}`]) {
        totalsByWeek[`Week ${weekNumber}`].income = entry.totalIncome || 0;
      } else {
        totalsByWeek[`Week ${weekNumber}`] = {
          income: entry.totalIncome || 0,
          expense: 0,
        };
      }
    });
    res.status(200).json({
      message: "Success",
      totalsByWeek,
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
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    ); // Get the first day of the last month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the last month

    const totalExpensePerWeek = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }, // Filter for transactions within the last month
          type: "Expense",
        },
      },
      {
        $group: {
          _id: { $week: { $toDate: "$date" } }, // Grouping by week
          totalExpense: { $sum: { $toDouble: "$amount" } }, // Calculate total expense for each week
        },
      },
    ]);

    const totalIncomePerWeek = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }, // Filter for transactions within the last month
          type: "Income",
        },
      },
      {
        $group: {
          _id: { $week: { $toDate: "$date" } }, // Grouping by week
          totalIncome: { $sum: { $toDouble: "$amount" } }, // Calculate total income for each week
        },
      },
    ]);

    const totalsByWeek = {};

    totalExpensePerWeek.forEach((entry) => {
      const weekNumber = entry._id;
      totalsByWeek[`Week ${weekNumber}`] = {
        expense: entry.totalExpense || 0,
        income: 0,
      };
    });

    totalIncomePerWeek.forEach((entry) => {
      const weekNumber = entry._id;
      if (totalsByWeek[`Week ${weekNumber}`]) {
        totalsByWeek[`Week ${weekNumber}`].income = entry.totalIncome || 0;
      } else {
        totalsByWeek[`Week ${weekNumber}`] = {
          income: entry.totalIncome || 0,
          expense: 0,
        };
      }
    });

    res.status(200).json({
      message: "Success",
      totalsByWeek,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

//Chart 2 Distribution Data
exports.expensesFrequencyDistribution = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const distribution = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          "<1000": {
            $sum: {
              $cond: [{ $lte: [{ $toDouble: "$amount" }, 1000] }, 1, 0],
            },
          },
          "1000-2000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 1000] },
                    { $lte: [{ $toDouble: "$amount" }, 2000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          "2000-5000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 2000] },
                    { $lte: [{ $toDouble: "$amount" }, 5000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          ">5000": {
            $sum: {
              $cond: [{ $gt: [{ $toDouble: "$amount" }, 5000] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          "<1000": "$<1000",
          "1000-2000": "$1000-2000",
          "2000-5000": "$2000-5000",
          ">5000": "$>5000",
        },
      },
    ]);

    if (distribution.length === 0) {
      return res.status(200).json({
        message: "Success",
        distribution: {
          "<1000": 0,
          "1000-2000": 0,
          "2000-5000": 0,
          ">5000": 0,
        },
      });
    }

    res.status(200).json({
      message: "Success",
      distribution: distribution[0],
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.expensesFrequencyDistributionLastWeek = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const thisWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() // Adjust to the start of the week (Sunday)
    );

    const distribution = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: thisWeekStart, $lte: today },
        },
      },
      {
        $group: {
          _id: null,
          "<1000": {
            $sum: {
              $cond: [{ $lte: [{ $toDouble: "$amount" }, 1000] }, 1, 0],
            },
          },
          "1000-2000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 1000] },
                    { $lte: [{ $toDouble: "$amount" }, 2000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          "2000-5000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 2000] },
                    { $lte: [{ $toDouble: "$amount" }, 5000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          ">5000": {
            $sum: {
              $cond: [{ $gt: [{ $toDouble: "$amount" }, 5000] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          "<1000": "$<1000",
          "1000-2000": "$1000-2000",
          "2000-5000": "$2000-5000",
          ">5000": "$>5000",
        },
      },
    ]);

    // Handle empty distribution
    if (distribution.length === 0) {
      return res.status(200).json({
        message: "Success",
        distribution: {
          "<1000": 0,
          "1000-2000": 0,
          "2000-5000": 0,
          ">5000": 0,
        },
      });
    }

    res.status(200).json({
      message: "Success",
      distribution: distribution[0],
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.expensesFrequencyDistributionLastMonth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    ); // Get the first day of the last month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the last month

    const distribution = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $group: {
          _id: null,
          "<1000": {
            $sum: {
              $cond: [{ $lte: [{ $toDouble: "$amount" }, 1000] }, 1, 0],
            },
          },
          "1000-2000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 1000] },
                    { $lte: [{ $toDouble: "$amount" }, 2000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          "2000-5000": {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $toDouble: "$amount" }, 2000] },
                    { $lte: [{ $toDouble: "$amount" }, 5000] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          ">5000": {
            $sum: {
              $cond: [{ $gt: [{ $toDouble: "$amount" }, 5000] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          "<1000": "$<1000",
          "1000-2000": "$1000-2000",
          "2000-5000": "$2000-5000",
          ">5000": "$>5000",
        },
      },
    ]);

    // Handle empty distribution
    if (distribution.length === 0) {
      return res.status(200).json({
        message: "Success",
        distribution: {
          "<1000": 0,
          "1000-2000": 0,
          "2000-5000": 0,
          ">5000": 0,
        },
      });
    }

    res.status(200).json({
      message: "Success",
      distribution: distribution[0],
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

//Chart 3 Income/Expense
exports.getCompareExpanseIncomeByMonth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    ); // Get the first day of the last month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the last month

    const totalExpensePerLastMonth = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }, // Filter for transactions within the last month
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalIncomePerLastMonth = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }, // Filter for transactions within the last month
          type: "Income",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalExpense =
      totalExpensePerLastMonth.length > 0
        ? totalExpensePerLastMonth[0].totalExpense
        : 0;
    const totalIncome =
      totalIncomePerLastMonth.length > 0
        ? totalIncomePerLastMonth[0].totalIncome
        : 0;

    res.status(200).json({
      Expense: totalExpense,
      Income: totalIncome,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getCompareExpanseIncomeByWeek = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    ); // Start of the current week (Sunday)
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 6
    ); // End of the current week (Saturday)
    const totalExpensePerWeek = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfWeek, $lte: endOfWeek }, // Filter for transactions within the current week
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalIncomePerWeek = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          date: { $gte: startOfWeek, $lte: endOfWeek }, // Filter for transactions within the current week
          type: "Income",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalExpense =
      totalExpensePerWeek.length > 0 ? totalExpensePerWeek[0].totalExpense : 0;
    const totalIncome =
      totalIncomePerWeek.length > 0 ? totalIncomePerWeek[0].totalIncome : 0;

    res.status(200).json({
      Expense: totalExpense,
      Income: totalIncome,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getCompareExpanseIncomeTotal = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const totalExpense = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalIncome = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Income",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const totalExpenses =
      totalExpense.length > 0 ? totalExpense[0].totalExpense : 0;
    const totalIncomes =
      totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;

    res.status(200).json({
      Expense: totalExpenses,
      Income: totalIncomes,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

//Chart 4 Category Expense

exports.getTotalExpenseByCategory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const expensesByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalExpense: { $sum: { $toDouble: "$amount" } },
          numberOfExpense: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalExpense: "$totalExpense",
          // numberOfExpense: '$numberOfExpense'
        },
      },
    ]);

    res.status(200).json({
      expensesByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getTotalExpenseByCategoryLastWeek = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

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

    const expensesByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalExpense: { $sum: { $toDouble: "$amount" } },
          numberOfExpense: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalExpense: "$totalExpense",
          numberOfExpense: "$numberOfExpense",
        },
      },
    ]);

    res.status(200).json({
      expensesByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
exports.getTotalExpenseByCategoryLastMonth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the previous month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month

    const expensesByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Expense",
          date: { $gte: lastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalExpense: { $sum: { $toDouble: "$amount" } },
          numberOfExpense: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalExpense: "$totalExpense",
          numberOfExpense: "$numberOfExpense",
        },
      },
    ]);

    res.status(200).json({
      expensesByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

//Chart 5 Category Income
exports.getTotalIncomeByCategory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const incomeByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Income",
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalIncome: { $sum: { $toDouble: "$amount" } },
          numberOfIncome: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalIncome: "$totalIncome",
          // numberOfIncome: '$numberOfIncome'
        },
      },
    ]);

    res.status(200).json({
      incomeByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getTotalIncomeByCategoryLastWeek = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

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

    const incomeByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Income",
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalIncome: { $sum: { $toDouble: "$amount" } },
          numberOfIncome: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalIncome: "$totalIncome",
          numberOfIncome: "$numberOfIncome",
        },
      },
    ]);

    res.status(200).json({
      incomeByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.getTotalIncomeByCategoryLastMonth = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the previous month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month

    const incomeByCategory = await NormalTransaction.aggregate([
      {
        $match: {
          user: objectIdUserId,
          type: "Income",
          date: { $gte: lastMonth, $lte: endOfLastMonth },
        },
      },
      {
        $lookup: {
          from: "categories", // Your categories collection name
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalIncome: { $sum: { $toDouble: "$amount" } },
          numberOfIncome: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalIncome: "$totalIncome",
          numberOfIncome: "$numberOfIncome",
        },
      },
    ]);

    res.status(200).json({
      incomeByCategory,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

//Chart 6 Wallet

exports.getTotalExpenseByWallet = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

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
          totalExpense: { $sum: { $toDouble: "$amount" } },
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
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

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
          totalExpense: { $sum: { $toDouble: "$amount" } },
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
    const { userId } = req.params;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Get the first day of the previous month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month

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
          totalExpense: { $sum: { $toDouble: "$amount" } },
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
