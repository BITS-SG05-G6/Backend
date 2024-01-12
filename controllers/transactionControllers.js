const Category = require("../models/category");
const NormalTransaction = require("../models/normalTransaction");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");
const Wallet = require("../models/wallet");
const Saving = require("../models/savingGoal");

// Create transaction
exports.createTransaction = async (req, res, next) => {
  const category =
    req?.body?.category === "none" || req?.body?.category === undefined
      ? null
      : req?.body?.category;
  const wallet =
    req?.body?.wallet === "none" || req?.body?.wallet === undefined
      ? null
      : req?.body?.wallet;
  let VNDAmount;
  let USDAmount;
  if (req?.body?.currency === "VND") {
    VNDAmount = req?.body?.amount;
    USDAmount = req?.body?.exchangeAmount;
  } else {
    USDAmount = req?.body?.amount;
    VNDAmount = req?.body?.exchangeAmount;
  }

  const addAmount = req.userID.baseCurrency === "VND" ? VNDAmount : USDAmount;
  const saving =
    req?.body?.saving === "none" || req?.body?.saving === undefined
      ? null
      : req?.body?.saving;
  const transactionData = {
    description: req?.body?.description,
    transactionType: req?.body?.transactionType,
    wallet: wallet,
    user: req.userID,
    category: category,
    date: req?.body?.date,
    type: req?.body?.type,
    title: req?.body?.title,
    currency: req?.body?.currency,
    VND: VNDAmount,
    USD: USDAmount,
    saving: saving,
    createdAt: new Date(Date.now()),
  };

  try {
    // console.log(transactionData);
    if (transactionData.transactionType == "Normal") {
      const createdTransaction = await NormalTransaction.create(
        transactionData
      );

      if (wallet) {
        const walletInfo = await Wallet.findById(wallet);

        await Wallet.findByIdAndUpdate(
          wallet,
          {
            amount:
              transactionData.type === "Expense"
                ? walletInfo.amount - addAmount
                : walletInfo.amount + addAmount,
          },
          {
            new: true,
          }
        );
      }

      if (category) {
        const categoryInfo = await Category.findById(category);

        await Category.findByIdAndUpdate(
          category,
          {
            budget:
              transactionData.type === "Expense"
                ? categoryInfo.budget - addAmount
                : categoryInfo.budget + addAmount,
          },
          {
            new: true,
          }
        );
      }

      res.status(200).json({
        message: "Transaction created successfully!",
        transaction: createdTransaction,
      });
      // console.log(transactionData);
    } else {
      return next(
        new ErrorHandler("Invalid type of transaction (Normal or Bill)!", 400)
      );
    }
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

    const transaction = await NormalTransaction.findById(transactionId);
    const addAmount =
      req.userID.baseCurrency === "VND" ? transaction.VND : transaction.USD;

    if (transaction.wallet) {
      const walletInfo = await Wallet.findById(transaction.wallet);

      await Wallet.findByIdAndUpdate(
        transaction.wallet._id,
        {
          amount:
            transaction.type === "Expense"
              ? walletInfo.amount + addAmount
              : walletInfo.amount - addAmount,
        },
        {
          new: true,
        }
      );
    }

    if (transaction.category) {
      const categoryInfo = await Category.findById(transaction.category);

      await Category.findByIdAndUpdate(
        transaction.category,
        {
          budget:
            transaction.type === "Expense"
              ? categoryInfo.budget + addAmount
              : categoryInfo.budget - addAmount,
        },
        {
          new: true,
        }
      );
    }

    await NormalTransaction.findByIdAndDelete(transactionId).catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });

    res.status(200).json({ message: "Transaction deleted successfully!" });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// View all transaction or filter by date
exports.viewAllTransactions = async (req, res, next) => {
  const filter = {
    date: req?.query?.date,
    user: req.userID,
  };

  try {
    // console.log(filter.date);
    if (filter.date === undefined || filter.date === null) {
      delete filter.date;
    }

    if (filter.date) {
      const parsedDate = new Date(filter.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new ErrorHandler("Invalid date format", 400));
      }

      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    const normalTransactions = await NormalTransaction.find(filter).catch(
      () => {
        return next(new ErrorHandler("Transactions not found", 404));
      }
    );

    if (normalTransactions.length == 0) {
      return res.status(200).json({ transactions: null });
    }

    const transactionList = await Promise.all(
      normalTransactions.map(async (transaction) => {
        const category = await Category.findById(transaction.category);
        const wallet = await Wallet.findById(transaction.wallet);
        const categoryName = category ? category.name : null;
        const categoryID = category ? category._id : null;
        const categoryColor = category ? category.color : null;
        const walletName = wallet ? wallet.name : null;
        const walletID = wallet ? wallet._id : null;
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
          wallet: transaction.wallet,
          description: transaction.description,
          categoryID: categoryID,
          walletName: walletName,
          walletID: walletID,
        };
      })
    );
    // Sort transactions based on created date (descending order)
    transactionList.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
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
      return res.status(200).json("");
    } else {
      const normalTransaction = await NormalTransaction.findById(
        req.params.transactionId
      ).catch(() => {
        // return res.status(200).json({transaction: null});
        return next(new ErrorHandler("Transaction not found", 404));
      });

      if (!normalTransaction) {
        return next(new ErrorHandler("Transaction not found", 404));
      }
      let categoryName = null;
      let categoryColor = null;
      let walletName;
      let walletColor;
      let savingName;
      let savingColor;
      if (normalTransaction.category) {
        const category = await Category.findById(
          normalTransaction.category
        ).catch(() => {
          return next(new ErrorHandler("Category not found", 404));
        });
        categoryName = category.name;
        categoryColor = category.color;
      }

      if (normalTransaction.wallet) {
        const wallet = await Wallet.findById(normalTransaction.wallet).catch(
          () => {
            return next(new ErrorHandler("Wallet not found", 404));
          }
        );

        walletName = wallet.name;
        walletColor = wallet.color;
      } else {
        walletName = null;
        walletColor = null;
      }

      const amount =
        normalTransaction.currency === "VND"
          ? normalTransaction.VND
          : normalTransaction.USD;

      if (normalTransaction.saving) {
        const savingGoal = await Saving.findById(
          normalTransaction.saving
        ).catch(() => {
          return next(new ErrorHandler("Saving goal not found", 404));
        });
        savingName = savingGoal.name;
        savingColor = savingGoal.color;
      } else {
        savingName = null;
        savingColor = null;
      }

      const transaction = {
        _id: normalTransaction._id,
        type: normalTransaction.type,
        title: normalTransaction.title,
        date: normalTransaction.date,
        description: normalTransaction.description,
        amount: amount,
        category: categoryName,
        categoryColor: categoryColor,
        wallet: walletName,
        walletColor: walletColor,
        saving: savingName,
        savingColor: savingColor,
        currency: normalTransaction.currency,
      };
      return res.status(200).json(transaction);
    }
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  const { transactionId } = req.params;
  const category =
    req?.body?.category === "none" || req?.body?.category === undefined
      ? null
      : req?.body?.category;
  const wallet =
    req?.body?.wallet === "none" || req?.body?.wallet === undefined
      ? null
      : req?.body?.wallet;
  let VNDAmount;
  let USDAmount;
  if (req?.body?.currency === "VND") {
    VNDAmount = req?.body?.amount;
    USDAmount = req?.body?.exchangeAmount;
  } else {
    USDAmount = req?.body?.amount;
    VNDAmount = req?.body?.exchangeAmount;
  }
  const data = {
    title: req?.body?.title,
    date: req?.body?.date,
    category: category,
    type: req?.body?.type,
    wallet: wallet,
    currency: req?.body?.currency,
    VND: VNDAmount,
    USD: USDAmount,
    description: req?.body?.description,
  };

  try {
    if (!transactionId) {
      return next(
        new ErrorHandler("Transaction ID and User ID are required", 400)
      );
    }

    const normalTransaction = await NormalTransaction.findById(
      transactionId
    ).catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });

    if (!normalTransaction) {
      return next(
        new ErrorHandler("Transaction not found for this User ID", 404)
      );
    }
    const oldCategory = await Category.findById(normalTransaction.category);
    const newCategory = await Category.findById(data.category);
    const oldWallet = await Wallet.findById(normalTransaction.wallet);
    const newWallet = await Wallet.findById(data.wallet);

    if (data.category) {
      if (normalTransaction.VND != data.VND) {
        const transactionAmount =
          normalTransaction.type === "Expense"
            ? req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD
            : -(req.userID.baseCurrency === "VND"
                ? normalTransaction.VND
                : normalTransaction.USD);

        const newTransactionAmount =
          data.type === "Expense"
            ? -(req.userID.baseCurrency === "VND" ? data.VND : data.USD)
            : req.userID.baseCurrency === "VND"
            ? data.VND
            : data.USD;

        if (normalTransaction.category != data.category) {
          oldCategory.budget += transactionAmount;

          newCategory.budget += newTransactionAmount;
        } else {
          oldCategory.budget += transactionAmount;
          oldCategory.budget += newTransactionAmount;
        }
      } else {
        const amount =
          normalTransaction.type === "Expense"
            ? req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD
            : -(req.userID.baseCurrency === "VND"
                ? normalTransaction.VND
                : normalTransaction.USD);

        if (normalTransaction.category != data.category) {
          oldCategory.budget += amount;
          newCategory.budget -= amount;
        } else {
          oldCategory.budget += amount;
          oldCategory.budget -= amount;
        }
      }
    } else if (!data.category && normalTransaction.category) {
      const amount =
        normalTransaction.type === "Expense"
          ? req.userID.baseCurrency === "VND"
            ? normalTransaction.VND
            : normalTransaction.USD
          : -(req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD);

      oldCategory.budget += amount;
    }

    console.log(JSON.stringify(oldCategory));
    if (oldCategory && newCategory) {
      if (JSON.stringify(oldCategory) === JSON.stringify(newCategory)) {
        await Category.findByIdAndUpdate(
          oldCategory._id,
          {
            budget: oldCategory.budget,
          },
          {
            new: true,
          }
        );
        console.log("old: " + oldCategory.budget);
  
      } else {
        console.log("old: " + oldCategory.budget);
        console.log("new: " + newCategory.budget);
  
        await Category.findByIdAndUpdate(
          oldCategory._id,
          {
            budget: oldCategory.budget,
          },
          {
            new: true,
          }
        );
  
        await Category.findByIdAndUpdate(
          newCategory._id,
          {
            budget: newCategory.budget,
          },
          {
            new: true,
          }
        );
      }
    } else if (oldCategory && newCategory === null) {
      await Category.findByIdAndUpdate(
        oldCategory._id,
        {
          budget: oldCategory.budget,
        },
        {
          new: true,
        }
      );
    } else if (newCategory && oldCategory === null) {
      await Category.findByIdAndUpdate(
        newCategory._id,
        {
          budget: newCategory.budget,
        },
        {
          new: true,
        }
      );
    }

    if (data.wallet) {
      if (normalTransaction.VND != data.VND) {
        const transactionAmount =
          normalTransaction.type === "Expense"
            ? req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD
            : -(req.userID.baseCurrency === "VND"
                ? normalTransaction.VND
                : normalTransaction.USD);

        const newTransactionAmount =
          data.type === "Expense"
            ? -(req.userID.baseCurrency === "VND" ? data.VND : data.USD)
            : req.userID.baseCurrency === "VND"
            ? data.VND
            : data.USD;

        if (normalTransaction.wallet != data.wallet) {
          oldWallet.amount += transactionAmount;

          newWallet.amount += newTransactionAmount;
        } else {
          oldWallet.amount += transactionAmount;
          oldWallet.amount += newTransactionAmount;
        }
      } else {
        const amount =
          normalTransaction.type === "Expense"
            ? req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD
            : -(req.userID.baseCurrency === "VND"
                ? normalTransaction.VND
                : normalTransaction.USD);

        if (normalTransaction.wallet != data.wallet) {
          oldWallet.amount += amount;
          newWallet.amount -= amount;
        } else {
          oldWallet.amount += amount;
          oldWallet.amount -= amount;
        }
      }
    } else if (!data.wallet && normalTransaction.wallet) {
      const amount =
        normalTransaction.type === "Expense"
          ? req.userID.baseCurrency === "VND"
            ? normalTransaction.VND
            : normalTransaction.USD
          : -(req.userID.baseCurrency === "VND"
              ? normalTransaction.VND
              : normalTransaction.USD);

      oldWallet.amount += amount;
    }

    if (oldWallet && newWallet) {
      if (JSON.stringify(oldWallet) === JSON.stringify(newWallet)) {
        await Wallet.findByIdAndUpdate(
          oldWallet._id,
          {
            amount: oldWallet.amount,
          },
          {
            new: true,
          }
        );
      } else {
        await Wallet.findByIdAndUpdate(
          oldWallet._id,
          {
            amount: oldWallet.amount,
          },
          {
            new: true,
          }
        );
  
        await Wallet.findByIdAndUpdate(
          newWallet._id,
          {
            amount: newWallet.amount,
          },
          {
            new: true,
          }
        );
      }
    } else if (oldWallet && newWallet === null) {
      await Wallet.findByIdAndUpdate(
        oldWallet._id,
        {
          amount: oldWallet.amount,
        },
        {
          new: true,
        }
      );
    } else if (newWallet && oldWallet === null) {
      await Wallet.findByIdAndUpdate(
        newWallet._id,
        {
          amount: newWallet.amount,
        },
        {
          new: true,
        }
      );
    }

    const updatedTransaction = await NormalTransaction.findByIdAndUpdate(
      transactionId, data,
      {
        new: true,
      }
    ).catch((err) => {
      next(new ErrorHandler(err.message, 404));
    });

    res.status(200).json({
      message: "Transaction updated successfully!",
      updatedTransaction,
    });
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
