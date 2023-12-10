const express = require('express')
const router = express.Router();
const wallet = require ('../controllers/walletController')
 

//Add Wallet
router.post("/create", wallet.createWallet);

//Delete Wallet
//Edit Wallet
router.get("/wallet", (req, res) =>{
    res.send("All Wallet")
})

module.exports = router;