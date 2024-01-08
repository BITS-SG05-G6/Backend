const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['VND', 'USD'],
  },
  VND: {
    type: Number,
    required: [true, 'VND is required']
  },
  USD: {
    type: Number,
    required: [true, 'USD is required']
  },
  transactionType: {
    type: String,
    enum: ['Normal', 'Bill'],
    required: [true]
  },
  // currency: {
  //   type: String,
  //   required: [true, 'Currency is required']
  // },
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
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = {Transaction, transactionSchema}