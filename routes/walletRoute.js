const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

//Add Wallet
router.post("/", walletController.addWallet);
//view all wallet
router.get("/", walletController.viewAllWallet);
//view a wallet
router.get("/:id", walletController.getAWallet);
//Update wallet
router.put("/:id", walletController.updateWallet);
//Delete Wallet
router.delete("/:id", walletController.deleteWallet);

module.exports = router;
