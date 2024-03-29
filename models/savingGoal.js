const mongoose = require('mongoose')

const savingGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Saving name is required']
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },
  target: {
    type: Number,
  },
  startDate: {
    type: Date,
    default: Date.now()
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['On-going', 'Completed'],
    default: 'On-going'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  total: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model("SavingGoal", savingGoalSchema);