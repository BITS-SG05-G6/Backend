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
  icon: {
    type: String
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
    enum: ['Pending','On-going', 'Completed'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model("SavingGoal", savingGoalSchema);