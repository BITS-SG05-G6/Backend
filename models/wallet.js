const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    unique: true,
  },
  amount: {
    type: Number,
    require: [true, "Amount is required"],
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },
  icon: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Wallet", walletSchema);
