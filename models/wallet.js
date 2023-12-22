const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is require"],
    unique: true,
  },
  amount: {
    type: Number,
    require: [true, "Amount is require"],
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
