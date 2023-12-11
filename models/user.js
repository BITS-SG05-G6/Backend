const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require:true
    },
    name:{
        type: String,
        require: true,
    },
    wallet: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Wallet",
        },
      ],
})
const User = mongoose.model("User", userSchema)
module.exports = {User, userSchema}
