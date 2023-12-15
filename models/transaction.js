const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  amount: {
    type: String,
    required: [true, 'Amount is required']
  },
  transactionType: {
    type: String,
    enum: ['Normal', 'Bill'],
    required: [true]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = {Transaction, transactionSchema}