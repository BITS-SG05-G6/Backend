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
});

// Hash the user's password before saving it to the database
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (!user.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(user.password, salt);
//   user.password = hash;
//   next();
// });

// // Compare password for login
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
