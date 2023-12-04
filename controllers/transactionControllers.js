const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");

// Create transaction
exports.createTransaction = async (req, res, next) => {
  const transactionData = {
    description: req?.body?.description,
    amount: req?.body?.amount,
    transactionType: req?.body?.transactionType,
    wallet: req?.body?.walletId,
    user: req?.body?.userId,
    date: req?.body?.date,
    type: req?.body?.type,
  };

  try {
    if (transactionData.transactionType == "Normal") {
      const createdTransaction = await NormalTransaction.create(
        transactionData
      );
      res.status(200).json({
        message: "Transaction created successfully!",
        transaction: createdTransaction,
      });
    } else {
      return next(
        new ErrorHandler("Invalid type of transaction (Normal or Bill)!", 400)
      );
    }
    // const date = new Date(transactionData.date).toLocaleDateString(
    //   "en-GB"
    // );
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  const { userId, transactionId } = req.params;

  try {
    if (!transactionId || !userId) {
      return next(new ErrorHandler("Transaction ID and User ID are required", 400));
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
      user: userId, 
    });

    if (!normalTransaction) {
      return next(new ErrorHandler("Transaction not found for this User ID", 404));
    }

    await NormalTransaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


// View all transaction or filter by date
exports.viewAllTransactions = async (req, res, next) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    if (!userId) {
      return next(new ErrorHandler("User ID is required", 400));
    }

    let query = { user: userId };

    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = {
        $gte: new Date(startDate),
        $lte: endOfDay,
      };
    }

    const normalTransactions = await NormalTransaction.find(query)
    .catch(() => {
      return next(new ErrorHandler("Transactions not found", 404));
    })

    if (!normalTransactions.length) {
      return next(new ErrorHandler("Transactions not found", 404));
    }

    res.status(200).json({ transactions: normalTransactions });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


// View a transaction
exports.viewTransactionDetail = async (req, res, next) => {
  const { userId } = req.params;
  const { transactionId } = req.params;

  try {
    if (!transactionId || !userId) {
      return next(new ErrorHandler("Transaction ID and User ID are required", 404));
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
      user: userId,
    })
    .catch(() => {
      return next(new ErrorHandler("Transaction not found", 404));
    })

    if (!normalTransaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }

    res.status(200).json({ transaction: normalTransaction });
  } catch (err) {
    console.error("Error:", err);
    next(new ErrorHandler(err.message, 500));
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  const { userId, transactionId } = req.params;
  const { amount,type, description } = req?.body;
  console.log(userId);
  console.log(transactionId);

  try {
    if (!transactionId || !userId) {
      return next(new ErrorHandler("Transaction ID and User ID are required", 400));
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!normalTransaction) {
      return next(new ErrorHandler("Transaction not found for this User ID", 404));
    }

    // Update the transaction fields
    normalTransaction.amount = amount || normalTransaction.amount;
    normalTransaction.description = description || normalTransaction.description;
    normalTransaction.type = type || normalTransaction.type;


    // Save the updated transaction
    await normalTransaction.save();

    res.status(200).json({ message: "Transaction updated successfully!", normalTransaction });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

