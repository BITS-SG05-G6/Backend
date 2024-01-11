const express = require("express");
const router = express.Router();
const wallet = require("../controllers/walletController");
const { isAuthenticated } = require("../middlewares/auth");

//Add Wallet
router.post("/", isAuthenticated, wallet.createWallet);

router.get("/view", isAuthenticated, wallet.getWallets);

router.get("/view/:id", isAuthenticated, wallet.getWallet);

router.delete("/delete/:id", isAuthenticated, wallet.deleteWallet);

router.put("/update/:id", isAuthenticated, wallet.updateWallet);

module.exports = router;
