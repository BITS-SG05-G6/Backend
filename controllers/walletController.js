const Category = require('../models/category');
const Wallet = require("../models/wallet");
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require("../models/normalTransaction");

exports.createWallet = async (req, res, next) => {
  const data = {
    name: req?.body?.name,
    amount: req?.body?.amount === undefined ? 0 : req?.body?.amount,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.icon,
    user: req.userID,
  };

  try {
    await Wallet.create(data)
      .then(() => {
        res.status(200).json("Create wallet successfully");
      })
      .catch((err) => {
        next(new ErrorHandler(err.message, 404));
      });
  } catch (err) {
    next(new (ErrorHandler(err.message, 404))());
  }
};

exports.getWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ user: req.userID });
    // const walletInfo = await Promise.all(wallets.map(async(wallet) => {
    //   const transactions = await NormalTransaction.find({user: req.userID, wallet: wallet})
    //   let amount = req.userID.baseCurrency === "VND" ? wallet.VND : wallet.USD;

    //   transactions.map((transaction) => {
    //     const transactionAmount = req.userID.baseCurrency === "VND" ? transaction.VND : transaction.USD;

    //       if (transaction.type === "Expense") {
    //         amount -= transactionAmount;
    //       } else if (transaction.type === "Income") {
    //         amount += transactionAmount;
    //       }
    //   })
    //   return {
    //     id: wallet._id,
    //     name: wallet.name,
    //     color: wallet.color,
    //     icon: wallet.icon,
    //     amount: amount,
    //   }
    // }))
    res.status(200).json(wallets);
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.getWallet = async (req, res, next) => {
  const walletId = req.params.id;
  try {
    const wallet = await Wallet.findById(walletId);
    const transactions = await NormalTransaction.find({
      user: req.userID,
      wallet: wallet,
    });
    const transactionList = await Promise.all(
      transactions.map(async (transaction) => {
        const category = await Category.findById(transaction.category);
        const categoryName = category ? category.name : null;
        const categoryID = category ? category._id : null;
        const categoryColor = category ? category.color : null;
        const amount =
          transaction.currency === "VND" ? transaction.VND : transaction.USD;

        return {
          _id: transaction._id,
          title: transaction.title,
          category: categoryName,
          amount: amount,
          color: categoryColor,
          type: transaction.type,
          currency: transaction.currency,
          createdAt: transaction.createdAt,
          date: transaction.date,
          wallet: wallet._id,
          description: transaction.description,
          categoryID: categoryID,
          walletName: wallet.name,
        };
      })
    );
    res.status(200).json({ wallet: wallet, transactions: transactionList });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

exports.deleteWallet = async (req, res, next) => {
  const transactionList = await NormalTransaction.find({
    wallet: req.params.id,
  });
  await Promise.all(
    transactionList.map(async (transaction) => {
      try {
        const updatedTransaction = await NormalTransaction.findByIdAndUpdate(
          transaction._id,
          { wallet: null },
          { new: true }
        );
        // Handle the updated transaction as needed
        // console.log(`Updated transaction with ID: ${updatedTransaction._id}`);
      } catch (err) {
        // Handle errors
        next(new ErrorHandler(err.message, 404));
      }
    })
  );
  await Wallet.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json("Delete successfully");
    })
    .catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });
};

exports.updateWallet = async (req, res, next) => {
  const walletId = req.params.id;

  const updateData = {
    name: req?.body?.name,
    amount: req?.body?.amount === undefined ? 0 : req?.body?.amount,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.description,
  };

  try {
    const updatedWallet = await Wallet.findByIdAndUpdate(walletId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedWallet) {
      // If the wallet with the given ID is not found
      return next(new ErrorHandler("Wallet not found", 404));
    }

    res.status(200).json(updatedWallet);
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
