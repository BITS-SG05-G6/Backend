const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  amount: {
    type: String,
    require: [true, 'Amount is required']
  },
  transactionType: {
    type: String,
    enum: ['Expense', 'Income'],
    required: [true]
  },
  description: {
    type: String
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  date : {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Transaction", transactionSchema)