const mongoose = require('mongoose')
const Transaction = require('./transaction')

const normalTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true]
  }
})

normalTransactionSchema.add(Transaction.transactionSchema)

module.exports = mongoose.model("Normal Transaction", normalTransactionSchema);