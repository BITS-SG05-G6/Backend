const mongoose = require('mongoose')
const Transaction = require('./transaction')

const normalTransactionSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  type: {
    type: String,
  }
})

normalTransactionSchema.add(Transaction.transactionSchema)

module.exports = mongoose.model("Normal Transaction", normalTransactionSchema);