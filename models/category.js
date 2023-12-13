const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required']
  },
  type: {
    type: String,
    enum: ['Expense', 'Income'],
    required: [true, 'Category type is required']
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
    ref: 'User'
  }
})

module.exports = mongoose.model("Category", categorySchema)