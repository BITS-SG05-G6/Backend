const express = require("express");
const router = express.Router();
const wallet = require("../controllers/walletController");
const {isAuthenticated} = require("../middlewares/auth");

//Add Wallet
router.post("/", isAuthenticated, wallet.createWallet);

router.get("/view", isAuthenticated, wallet.getWallet);

router.delete("/delete/:id", isAuthenticated, wallet.deleteWallet);

module.exports = router;
