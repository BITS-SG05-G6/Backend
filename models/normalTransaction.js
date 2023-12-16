const mongoose = require('mongoose')
const Transaction = require('./transaction')

const normalTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    // required: [true, 'Type is required']
  }
})

normalTransactionSchema.add(Transaction.transactionSchema)

module.exports = mongoose.model("Normal Transaction", normalTransactionSchema);