const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.getWalletStatistics7days = async (req, res, next) => {
    const user = req.userID;
    const { walletID, currencyType } = req.params;
    
    const objectIdUserId = new mongoose.Types.ObjectId(user);
    const objectIdWalletId = new mongoose.Types.ObjectId(walletID);
    
    try {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Get the date one week ago
      
      const transactionsPerWalletAndDate = await NormalTransaction.aggregate([
        {
          $match: {
            user: objectIdUserId,
            wallet: objectIdWalletId,
            date: { $gte: oneWeekAgo, $lte: today }, // Filter for transactions within the last 7 days
            type: { $in: ["Expense", "Income"] }, // Filter both expense and income transactions
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              currency: "$currency",
              type: "$type",
            },
            totalAmount: {
              $sum: {
                $cond: [
                  { $eq: ["$currency", "VND"] },
                  "$VND", // Take value from VND field if currency is VND
                  {
                    $cond: [
                      { $eq: ["$currency", "USD"] },
                      "$USD", // Take value from USD field if currency is USD
                      0 // Otherwise, default to 0
                    ]
                  }
                ]
              }
            },
          },
        },
        {
          $group: {
            _id: {
              date: "$_id.date",
              currency: "$_id.currency"
            },
            expenses: {
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
        {
          $group: {
            _id: "$_id.date",
            totalsByCurrency: {
              $push: {
                currency: "$_id.currency",
                expenses: "$expenses",
                income: "$income",
              }
            }
          }
        },
      ]);
  
      const totalsByDate = {};
      transactionsPerWalletAndDate.forEach((entry) => {
        const date = entry._id;
        totalsByDate[date] = entry.totalsByCurrency;
      });
  
      res.status(200).json({
        message: "Success",
        totalsByDate,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  };
  