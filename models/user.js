const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: [true, "Username is required"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  baseCurrency: {
    type: String,
    required: [true, "Base currency is required"],
    enum: ["VND", "USD"],
    default: "VND"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

