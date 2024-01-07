const mongoose = require('mongoose')
const Transaction = require('./transaction')

const normalTransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Saving'],
    required: [true, 'Type is required']
  },
  saving: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Saving'
  },
})

normalTransactionSchema.add(Transaction.transactionSchema)

module.exports = mongoose.model("Normal Transaction", normalTransactionSchema);