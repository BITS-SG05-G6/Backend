const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Bill title is required"],
  },
  reminder: Boolean,
  dueDate: {
    type: Date,
    required: [true, "Due Date is required"],
  },
  nextDueDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["Paid", "Not Paid"],
    required: [true, "Status is required"],
  },
  frequency: {
    type: String,
    enum: ["Every Day", "Every Week", "Every Month", "Every Year"],
  },
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = { Bill, billSchema };
