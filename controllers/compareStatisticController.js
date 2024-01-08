const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");


// Chart: Compare between Income and Expense
exports.getCompareExpanseIncomeByMonth = async (req, res, next) => {
    try {
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
