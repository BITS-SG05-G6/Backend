const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

//Chart 1: Trend statistic
exports.getTransactionStatistics7days = async (req, res, next) => {
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);

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
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);

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
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);

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
