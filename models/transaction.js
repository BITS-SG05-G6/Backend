const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  amount: {
    type: String,
    require: [true, 'Amount is required']
  },
  transactionType: {
    type: String,
    enum: ['Normal', 'Bill'],
    required: [true]
  },
  description: {
    type: String
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  }
})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = {Transaction, transactionSchema}