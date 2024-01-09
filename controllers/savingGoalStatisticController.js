const NormalTransaction = require("../models/normalTransaction");
const Saving = require('../models/savingGoal');
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getTotalAndTargetByDate = async (req, res, next) => {
  const user = req.userID;
  const { savingID } = req.params;

  try {
    const transactions = await NormalTransaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user),
          saving: new mongoose.Types.ObjectId(savingID),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$VND" }, // Summing the VND attribute
        },
      },
    ]);

    const savingGoal = await Saving.findById(savingID);
    if (!savingGoal) {
      return next(new ErrorHandler("Saving goal not found", 404));
    }

    const targetsByDate = transactions.map((transaction) => {
      const { _id, total } = transaction;
      const targetDate = _id;
      const target = savingGoal.target || 0; // Assuming target is stored in the SavingGoal model
      return {
        date: targetDate,
        target: target,
        total: total,
      };
    });

    res.status(200).json({ targetsList: targetsByDate });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
