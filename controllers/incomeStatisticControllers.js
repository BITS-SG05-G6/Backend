const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");


//Chart: Income by category 
exports.getTotalIncomeByCategory = async (req, res, next) => {
  try {
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

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
          totalIncome: { $sum: `$${currencyField}` },
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
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

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

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

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
          totalIncome: { $sum: `$${currencyField}` },
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
    const user = req.userID;
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const baseCurrency = req.userID.baseCurrency;

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const currencyField = baseCurrency === "VND" ? "VND" : "USD";

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
          from: "categories",
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
          totalIncome: { $sum: `$${currencyField}` },
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

