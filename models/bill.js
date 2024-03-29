const mongoose = require("mongoose");
const Transaction = require('./transaction')

const billSchema = new mongoose.Schema({
  reminder: {
    type: Boolean,
    required: [true, "Reminder is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start Date is required"],
    // default: new Date(),
  },
  nextDueDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid"
  },
  frequency: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly", "Quarterly", "Anually", "None"],
  },
  updateAt: {
    type: Date,
  }
});

billSchema.add(Transaction.transactionSchema)

module.exports = mongoose.model("Bill", billSchema);
