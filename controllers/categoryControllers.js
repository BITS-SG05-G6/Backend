const Category = require("../models/category");
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require("../models/normalTransaction");
const Wallet = require("../models/wallet");

exports.createCategory = async (req, res, next) => {
  const data = {
    name: req?.body?.name,
    type: req?.body?.type,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.description,
    budget: req?.body?.budget === undefined ? 0 : req?.body?.budget,
    user: req.userID,
  };

  try {
    const existedCategory = await Category.findOne({
      name: data.name,
      type: data.type,
    });

    if (existedCategory) {
      return next(new ErrorHandler("Category had been existed", 404));
    }

    await Category.create(data)
      .then(() => {
        res.status(200).json("Create category successfully");
      })
      .catch((err) => {
        next(new ErrorHandler(err.message, 404));
      });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.viewCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.userID });
    res.status(200).json(categories);
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.viewCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const categoryFound = await Category.findById(id);
    const transactions = await NormalTransaction.find({
      user: req.userID,
      category: categoryFound,
    });
    let amount = 0;
    // transactions.map((transaction) => {
    //   // console.log(transaction);
    //   const transactionAmount =
    //     transaction.currency === "VND" ? transaction.VND : transaction.USD;
    //   amount += transactionAmount;
    // });

    const transactionList = await Promise.all(
      transactions.map(async (transaction) => {
        const wallet = await Wallet.findById(transaction.wallet);
        const walletName = wallet ? wallet.name : null;
        const walletID = wallet ? wallet._id : null;
        const amount =
          transaction.currency === "VND" ? transaction.VND : transaction.USD;

        return {
          _id: transaction._id,
          title: transaction.title,
          category: categoryFound.name,
          amount: amount,
          color: categoryFound.color,
          type: transaction.type,
          currency: transaction.currency,
          createdAt: transaction.createdAt,
          date: transaction.date,
          wallet: transaction.wallet,
          description: transaction.description,
          categoryID: categoryFound._id,
          walletName: walletName,
          walletID: walletID,
        };
      })
    );

    const category = {
      id: categoryFound._id,
      name: categoryFound.name,
      type: categoryFound.type,
      color: categoryFound.color,
      icon: categoryFound.icon,
      budget: categoryFound.budget,
      amount: amount,
    };

    res.status(200).json({ category: category, transactions: transactionList });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.deleteCategory = async (req, res, next) => {
  const transactionList = await NormalTransaction.find({
    category: req.params.id,
  });
  await Promise.all(
    transactionList.map(async (transaction) => {
      try {
        const updatedTransaction = await NormalTransaction.findByIdAndUpdate(
          transaction._id,
          { category: null }, // Set the category field to null
          { new: true }
        );

        // Handle the updated transaction as needed
      } catch (err) {
        // Handle errors
        next(new ErrorHandler(err.message, 404));
      }
    })
  );
  await Category.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json("Delete successfully");
    })
    .catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });
};

// Update Category
exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name, type, color, icon, description, budget } = req.body;

  try {
    const categoryToUpdate = await Category.findById(categoryId);

    if (!categoryToUpdate) {
      return next(new ErrorHandler("Category not found", 404));
    }

    // Update the category properties
    categoryToUpdate.name = name || categoryToUpdate.name;
    categoryToUpdate.type = type || categoryToUpdate.type;
    categoryToUpdate.color = color || categoryToUpdate.color;
    categoryToUpdate.icon = icon || categoryToUpdate.icon;
    categoryToUpdate.description = description || categoryToUpdate.description;
    categoryToUpdate.budget =
      budget === undefined ? categoryToUpdate.budget : budget;

    await categoryToUpdate.save();

    res.status(200).json("Category updated successfully");
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};
