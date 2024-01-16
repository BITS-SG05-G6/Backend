const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");


// Chart: Compare between Income and Expense
exports.getCompareExpanseIncomeByMonth = async (req, res, next) => {
    try {
        const user = req.userID;
        const baseCurrency = req.userID.baseCurrency;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

        const today = new Date();
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

        const totalExpensePerLastMonth = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    type: "Expense",
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: `$${currencyField}` },
                },
            },
        ]);

        const totalIncomePerLastMonth = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    type: "Income",
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: `$${currencyField}` },
                },
            },
        ]);

        const totalExpense =
            totalExpensePerLastMonth.length > 0 ? totalExpensePerLastMonth[0].totalExpense : 0;
        const totalIncome =
            totalIncomePerLastMonth.length > 0 ? totalIncomePerLastMonth[0].totalIncome : 0;

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
        const baseCurrency = req.userID.baseCurrency;
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

        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

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
                    totalExpense: { $sum: `$${currencyField}` }, // Consider the selected base currency
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
                    totalIncome: { $sum: `$${currencyField}` }, // Consider the selected base currency
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
        const baseCurrency = req.userID.baseCurrency;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

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
                    totalExpense: { $sum: `$${currencyField}` },
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
                    totalIncome: { $sum: `$${currencyField}` },
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

exports.getCompareExpanseIncomeThisMonth = async (req, res, next) => {
    try {
        const user = req.userID;
        const baseCurrency = req.userID.baseCurrency;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

        const today = new Date();
        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

        const totalExpensePerCurrentMonth = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
                    type: "Expense",
                },
            },
            {
                $group: {
                    _id: null,
                    totalExpense: { $sum: `$${currencyField}` },
                },
            },
        ]);

        const totalIncomePerCurrentMonth = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
                    type: "Income",
                },
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: `$${currencyField}` },
                },
            },
        ]);

        const totalExpense =
            totalExpensePerCurrentMonth.length > 0 ? totalExpensePerCurrentMonth[0].totalExpense : 0;
        const totalIncome =
            totalIncomePerCurrentMonth.length > 0 ? totalIncomePerCurrentMonth[0].totalIncome : 0;

        res.status(200).json({
            Expense: totalExpense,
            Income: totalIncome,
        });
    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};
