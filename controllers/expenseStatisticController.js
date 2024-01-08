const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

// Chart:  Distribution Data
exports.expensesFrequencyDistribution = async (req, res, next) => {
    try {
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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

// Chart: Expense by category 

exports.getTotalExpenseByCategory = async (req, res, next) => {
    try {
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);
console.log(objectIdUserId)
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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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
        const user = req.userID;
        const objectIdUserId = new mongoose.Types.ObjectId(user);

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

