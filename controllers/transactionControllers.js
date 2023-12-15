const Category = require("../models/category");
const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");

// Create transaction
exports.createTransaction = async (req, res, next) => {
  const transactionData = {
    description: req?.body?.description,
    amount: req?.body?.amount,
    transactionType: req?.body?.transactionType,
    wallet: req?.body?.walletId,
    user: req.userID,
    category: req?.body?.category,
    date: req?.body?.date,
    type: req?.body?.type,
    title: req?.body?.title,
  };
  // res.status(200).json(transactionData);
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
  const { transactionId } = req.params;

  try {
    if (!transactionId) {
      return next(new ErrorHandler("Transaction ID are required", 400));
    }

    const normalTransaction = await NormalTransaction.findOne({
      _id: transactionId,
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
  const filter = {
    date: req?.query?.date,
    user: req.userID
  }
  // const { date } = req.query;
  // console.log(date);
  // console.log(filter.date);
  try {

    if (filter.date === undefined) {
      delete filter.date;
    }

    // if (date) {
      const parsedDate = new Date(filter.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new ErrorHandler("Invalid date format", 400));
      }
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0,0,0,0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23,59,59,999);
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
      // console.log(startOfDay.toISOString());
    // }

    // console.log(filter);

    const normalTransactions = await NormalTransaction.find(filter)
    .catch(() => {
      return next(new ErrorHandler("Transactions not found", 404));
    })

    if (!normalTransactions.length) {
      res.status(200).json({transactions: null});
      // return next(new ErrorHandler("Transactions not found", 404));
    }

    const transactionList = await Promise.all(normalTransactions.map(async(transaction) => {
      const category = await Category.findById(transaction.category);
      let categoryName;
      let categoryColor;
      if (category) {
        categoryName = category.name;
        categoryColor = category.color;
      } else {
        categoryName = null;
        categoryColor = "#FCDDEC"
      } 
      return {
        _id: transaction._id,
        title: transaction.title,
        category: categoryName,
        amount: transaction.amount,
        color: categoryColor
      }
    }))
    // console.log(transactionList);

    res.status(200).json({ transactions: transactionList });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};



// View a transaction
exports.viewTransactionDetail = async (req, res, next) => {
  const { transactionId } = req.params;
  // console.log(transactionId);
  try {
    if (transactionId === "undefined") {
      // console.log(123)
      return res.status(200).json(null);
      // return next(new ErrorHandler("Transaction ID and User ID are required", 404));
    }

    const normalTransaction = await NormalTransaction.findById(req.params.transactionId)
      .catch(() => {
        // return res.status(200).json({transaction: null});
        return next(new ErrorHandler("Transaction not found", 404));
      })

    if (!normalTransaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }

    if (normalTransaction.category) {
      const category = await Category.findById(normalTransaction.category)
      .catch(() => {
        return next(new ErrorHandler("Category not found", 404))
      })
      // console.log(category);
      const transaction = {
        _id: normalTransaction._id,
        type: normalTransaction.type,
        title: normalTransaction.title,
        date: normalTransaction.date,
        description: normalTransaction.description,
        amount: normalTransaction.amount,
        category: category.name,
        categoryColor: category.color
      }

      return res.status(200).json(transaction);
    }
    

    res.status(200).json(normalTransaction);
  } catch (err) {
    // console.error("Error:", err);
    next(new ErrorHandler(err.message, 500));
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  const { userId, transactionId } = req.params;
  const { amount, type, description, title } = req?.body;
  // console.log(userId);
  // console.log(transactionId);

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
    normalTransaction.title = title || normalTransaction.title;


    // Save the updated transaction
    await normalTransaction.save();

    res.status(200).json({ message: "Transaction updated successfully!", normalTransaction });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

