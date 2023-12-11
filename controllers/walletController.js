const { Wallet } = require("../models/wallet");
const ErrorHandler = require ("../utils/ErrorHandler")
const { User } = require("../models/user");
//Add Walllet
const walletController = {
  //create a wallet
  addWallet: async (req, res, next) => {

    try {
      const newWallet = new Wallet(req.body);
      const createdWallet = await newWallet.save();
      if(req.body.user){
        const user = User.findById(req.body.user)
        await user.updateOne({$push: {wallet: createdWallet._id}})
      }
      res.status(200).json({
        message: "Wallet created successfully!",
        Wallet: createdWallet,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },

  //view all wallet
  viewAllWallet: async (req, res, next) => {
    try {
      const wallets = await Wallet.find();
      res.status(200).json(wallets);
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },
  getAWallet: async(req, res, next) => {
    try {
      const wallet = await Wallet.findById(req.params.id).populate("user");
      res.status(200).json(wallet)
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },
  updateWallet: async(req, res, next) => {
    try {
      const wallet = await Wallet.findById(req.params.id)
      await wallet.updateOne({$set: req.body})
      res.status(200).json("Updated succesfully")
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },
  deleteWallet: async(req, res, next) => {
    try {
      
    } catch (err) {
      next(new ErrorHandler(err.message, 500));

    }
  }
}

module.exports = walletController;