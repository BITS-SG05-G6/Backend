const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");

//Create transaction
exports.createTransaction = async (req, res, next) => {
  const { description, amount, transactionType, walletId, type, userId } = req?.body;

  if (!description) {
    return next(new ErrorHandler("Description is required", 400));
  }

  if (!amount) {
    return next(new ErrorHandler("Amount is required", 400));
  }

  if (!transactionType) {
    return next(new ErrorHandler("Transaction type is required", 400));
  }

  if (!walletId) {
    return next(new ErrorHandler("Wallet ID is required", 400));
  }

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  try {
    const transactionData = {
      description,
      amount,
      transactionType,
      wallet: walletId,
      user: userId,
      type,
    };
    if (transactionType == "Normal") {
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
  } catch (err) {
    console.log("Error");
    next(new ErrorHandler(err.message, 500));
  }
};

//Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  const { userId, transactionId } = req.params;
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

    await NormalTransaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};


//View all transaction or filter by date
exports.viewAllTransactions = async (req, res, next) => {
  const { userId } = req.params;
  const { date } = req.query; 

  try {
    if (!userId) {
      return next(new ErrorHandler("User ID is required", 400));
    }

    let query = { user: userId };

    if (date) {
      // Assuming 'date' is in ISO format (e.g., '2023-12-05')
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const normalTransactions = await NormalTransaction.find(query);

    if (!normalTransactions.length) {
      return next(new ErrorHandler("Transactions not found for this user ID or date", 404));
    }

    res.status(200).json({ transactions: normalTransactions });
  } catch (err) {
    console.error("Error:", err);
    next(new ErrorHandler(err.message, 500));
  }
};



//View a transaction

exports.viewTransactions = async (req, res, next) => {
  const { userId } = req.params;
  const { transactionId } = req.params;

  try {
    if (!transactionId || !userId) {
      return next(new ErrorHandler("Transaction ID and User ID are required", 400));
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!normalTransaction) {
      return next(new ErrorHandler("Transaction not found for this ID and User ID", 404));
    }

    res.status(200).json({ transaction: normalTransaction });
  } catch (err) {
    console.error("Error:", err);
    next(new ErrorHandler(err.message, 500));
  }
};

//Update transaction
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

