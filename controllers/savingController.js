const SavingGoal = require("../models/savingGoal");
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require("../models/normalTransaction");

// Create a saving goal
exports.createGoal = async (req, res, next) => {
  // Retrieve fields of the saving from the form data
  const data = {
    name: req?.body?.name,
    target: req?.body?.target,
    color: req?.body?.color,
    startDate: req?.body?.startDate,
    endDate: req?.body?.endDate,
    description: req?.body?.description,
    status: req?.body?.status,
    user: req.userID,
  };

  // Create the new saving goal if its name doesn't exist
  try {
    //   console.log(data);
    const existedGoal = await SavingGoal.findOne({ name: data.name });
    if (existedGoal) {
      return next(new ErrorHandler("Saving goal existed", 404));
    }
    const savingGoal = await SavingGoal.create(data);
    // console.log(savingGoal);
    res.status(200).json("Saving goal created successfully");
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

// View all saving goals of the user
exports.viewGoals = async (req, res, next) => {
  const userId = req.userID;
  try {
    const savingGoals = await SavingGoal.find({ user: userId });
    // // Update the tota current progress of each saving goal
    await Promise.all(
      savingGoals.map(async (savingGoal) => {
        // Find the transactions related to the goal
        const transactions = await NormalTransaction.find({
          saving: savingGoal,
        });
        // Calculate the current total amount
        const totalProgress = transactions.reduce((acc, curr) => {
          const amount =
            req.userID.baseCurrency === "VND" ? curr.VND : curr.USD;
          return acc + amount;
        }, 0);
        savingGoal.total = totalProgress;
        await savingGoal.save();
      })
    );
    res.status(200).json(savingGoals);
    if (savingGoals.length == 0) {
      return new ErrorHandler("No saving goal found", 404);
    }
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// View a saving goal details, including the related transactions
exports.viewGoal = async (req, res, next) => {
  const goalId = req?.params?.id;
  try {
    const savingGoal = await SavingGoal.findById({ _id: goalId });
    // Find the transactions related to the goal
    const transactions = await NormalTransaction.find({ user: req.userID, saving: goalId });
    // Calculate the current total amount
    res.status(200).json({ savingGoal, transactions });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.deleteGoal = async (req, res, next) => {
  const goalId = req.params.id;
  try {
    const transactions = await NormalTransaction.find({ saving: goalId });
    // Remove all related transactions
    await Promise.all(
      transactions.map(async (transaction) => {
        try {
          await NormalTransaction.findByIdAndDelete(
            transaction._id
          );
          // Handle the updated transaction as needed
        } catch (err) {
          // Handle errors
          next(new ErrorHandler(err.message, 404));
        }
      })
    );

    // Delete the goal
    await SavingGoal.findByIdAndDelete(goalId);
    res.status(200).json("Goal successfully deleted");
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Update a saving goal's information
exports.updateGoal = async (req, res, next) => {
  const goalId = req.params.id;

  // Retrieve fields of the saving goal from the form data
  const dataToUpdate = {
    name: req?.body?.name,
    color: req?.body?.color,
    description: req?.body?.description,
    target: req?.body?.target,
    startDate: req?.body?.startDate,
    endDate: req?.body?.endDate,
    status: req?.body?.status,
  };

  try {
    // Check if the goal with the given ID exists
    const existingGoal = await SavingGoal.findById(goalId);
    if (!existingGoal) {
      return next(new ErrorHandler("Saving goal not found", 404));
    }
    // Update the goal with the new data
    const updatedGoal = await SavingGoal.findByIdAndUpdate(
      goalId,
      dataToUpdate,
      { new: true }
    );
    // console.log(updatedGoal);
    res.status(200).json("Saving goal updated successfully");
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};

// Update goal status
exports.updateStatus = async (req, res, next) => {
  const goalId = req.params.id;
  const status = req?.body?.status;

  try {
    const savingGoal = await SavingGoal.findById(goalId);
    if (!savingGoal) {
      return new ErrorHandler("Saving goal not found", 404);
    }
    savingGoal.status = status;
    await savingGoal.save();
  } catch (err) {
    next(new ErrorHandler(err.message, 500));
  }
};
