const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  walletName: {
    type: String,
    required: [true, 'Wallet name is required']
  },
  balance: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model("Wallet", walletSchema)
