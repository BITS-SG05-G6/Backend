const Wallet = require("../models/wallet");
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require("../models/normalTransaction");

exports.createWallet = async(req, res, next) => {
  const amount = req?.body?.amount === undefined ? 0 : req?.body?.amount;
  const data = {
    name: req?.body?.name,
    amount: amount,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.icon,
    user: req.userID,
    currency: req?.body?.currency,
  }

  try {
    await Wallet.create(data)
    .then(() => {
      res.status(200).json("Create wallet successfully")
    })
    .catch((err) => {
      next(new ErrorHandler(err.message, 404))
    })

  } catch (err) {
    next(new(ErrorHandler(err.message, 404)))
  }
}

exports.getWallet = async(req, res, next) => {
  try {
    const wallets = await (Wallet.find({user: req.userID}))
    const walletInfo = await Promise.all(wallets.map(async(wallet) => {
      const transactions = await NormalTransaction.find({user: req.userID, wallet: wallet})
      let amount = wallet.amount;
      transactions.map((transaction) => {
        if (transaction.type === "Expense") {
          amount -= transaction.amount;
        } else if (transaction.type === "Income") {
          amount += transaction.amount;
        }
      })
      return {
        id: wallet._id,
        name: wallet.name,
        color: wallet.color,
        icon: wallet.icon,
        amount: amount,
        currency: wallet.currency,
      }
    }))
    res.status(200).json(walletInfo);
  } catch (err) {
    next(new ErrorHandler(err.message, 404))
  }
}

exports.deleteWallet = async(req, res, next) => {
  const transactionList = await NormalTransaction.find({wallet: req.params.id})
  await Promise.all(transactionList.map(async (transaction) => {
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
  }));
  await Wallet.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json("Delete successfully")
  })
  .catch((err) => {
    next(new ErrorHandler(err.message, 404))
  })
}
