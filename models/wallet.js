const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    unique: true,
  },
  VND: {
    type: Number,
    require: [true, "VND is required"],
  },
  USD: {
    type: Number,
    require: [true, "USD is required"],
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
