const { Wallet } = require("../models/wallet");
const ErrorHandler = require ("../utils/ErrorHandler")

//Add Walllet
exports.createWallet = async (req, res, next) => {
    res.status(200).json(req.body)
    const walletData = {
        title: req?.body?.title,
        amount: req?.body?.amount,
        user: req?.body?.userId,
    };

    try {
        if (walletData.walletType == "Normal") {
          const createdWallet = await Wallet.create(
            walletData
          );
          res.status(200).json({
            message: "Wallet created successfully!",
            wallet: createdWallet,
          });
        } else {
          return next(
            new ErrorHandler("Invalid type of transaction (Normal or Bill)!", 400)
          );
        }
    } catch (err) {
        next(new ErrorHandler(err.message, 500));
      }
};

// exports.deleteWalllet = async (req, res, next) =>{
//     const {userId, walletID} = req.params;

//     try{
//         if(!walletID || !userId){
//             return next(new ErrorHandler("Wallet ID and User ID are require"))
//         }

//         const Wallet = await Wallet.findOne({
//             _id = walletID,
//             user: userId,
//         });

//         if(!Wallet){

//         }
//     }
// };