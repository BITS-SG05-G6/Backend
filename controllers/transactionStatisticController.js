const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

//Chart 1: Trend statistic
exports.getTransactionStatistics7days = async (req, res, next) => {
    const user = req.userID;
    const baseCurrency = req.userID.baseCurrency;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
console.log(baseCurrency);
    try {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago

        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

        const totalPerDay = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
                },
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    type: 1,
                    amount: `$${currencyField}`, // Select the currency field based on the baseCurrency
                },
            },
            {
                $group: {
                    _id: { date: "$date", type: "$type" },
                    totalAmount: { $sum: "$amount" },
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

        const totalsByDay = {};
        totalPerDay.forEach((entry) => {
            const date = entry._id;
            totalsByDay[date] = {
                expense: entry.expense || 0,
                income: entry.income || 0,
            };
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
    const baseCurrency = req.userID.baseCurrency; 
    const objectIdUserId = new mongoose.Types.ObjectId(user);

    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

        const totalPerDay = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: firstDayOfMonth, $lte: today }, // Filter for transactions within the current month
                },
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    type: 1,
                    amount: `$${currencyField}`, // Select the currency field based on the baseCurrency
                },
            },
            {
                $group: {
                    _id: { date: "$date", type: "$type" },
                    totalAmount: { $sum: "$amount" },
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

        const totalsByWeek = {};
        totalPerDay.forEach((entry) => {
            const date = entry._id;
            totalsByWeek[date] = {
                expense: entry.expense || 0,
                income: entry.income || 0,
            };
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
    const baseCurrency = req.userID.baseCurrency;
    const objectIdUserId = new mongoose.Types.ObjectId(user);

    try {
        const today = new Date();
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        console.log(startOfLastMonth)
        console.log(endOfLastMonth)
        const currencyField = baseCurrency === "VND" ? "VND" : "USD";

        const totalPerWeek = await NormalTransaction.aggregate([
            {
                $match: {
                    user: objectIdUserId,
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                },
            },
            {
                $project: {
                    week: { $week: { $toDate: "$date" } },
                    type: 1,
                    amount: `$${currencyField}`,
                },
            },
            {
                $group: {
                    _id: { week: "$week", type: "$type" },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $group: {
                    _id: "$_id.week",
                    expense: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "Expense"] }, "$totalAmount", 0] },
                    },
                    income: {
                        $sum: { $cond: [{ $eq: ["$_id.type", "Income"] }, "$totalAmount", 0] },
                    },
                },
            },
        ]);

        const totalsByWeek = {};

        totalPerWeek.forEach((entry) => {
            const weekNumber = entry._id;
            totalsByWeek[`Week ${weekNumber}`] = {
                expense: entry.expense || 0,
                income: entry.income || 0,
            };
        });

        res.status(200).json({
            message: "Success",
            totalsByWeek,
        });
    } catch (err) {
        next(new ErrorHandler(err.message, 500));
    }
};
