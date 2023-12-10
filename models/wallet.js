const mongoose = require('mongoose')


const walletSchema= new mongoose.Schema({
    name:{
        type: String,
        require:[true , 'Name is require'],
        unique: true
    },
    amount:{ 
        type: Number,
        require: [true , 'Amoutn is require']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Wallet = mongoose.model("Wallet", walletSchema)

module.exports = {Wallet, walletSchema}
