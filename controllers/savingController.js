const SavingGoal = require('../models/savingGoal');
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require('../models/normalTransaction');
const savingGoal = require('../models/savingGoal');

// Create a saving goal 
exports.createGoal = async (req, res, next) => {
    // Retrieve fields of the saving from the form data
    const data = {
        name: req?.body?.name,
        color: req?.body?.color,
        icon: req?.body?.icon,
        description: req?.body?.description,
        target: req?.body?.target,
        startDate: req?.body?.startDate,
        endDate: req?.body?.endDate,
        status: req?.body?.status,
        user: req.userID
    }

    // Create the new saving goal if its name doesn't exist 
    try {
        const existedGoal = await SavingGoal.findOne({ name: data.name });
        if (existedGoal) {
            return next(new ErrorHandler("Saving goal existed", 404))
        }
        const savingGoal = await SavingGoal.create(data);
        console.log(savingGoal);
        res.status(200).json("Saving goal created successfully");

    } catch (err) {
        next(new ErrorHandler(err.message, 404))
    }
}

// View all saving goals of the user
exports.viewGoals = async (req, res, next) => {
    const userId = req.userID
    try {
        const savingGoals = await SavingGoal.find({ user: userId });
        res.status(200).json(savingGoals);
        if (savingGoals.length == 0) {
            return new ErrorHandler('No saving goal found', 404);
        }
    }
    catch (err) {
        next(new ErrorHandler(err.message, 500))
    }
}

// View a saving goal details, including the related transactions
exports.viewGoal = async (req, res, next) => {
    const goalId = req?.params?.id;
    try {
        const savingGoal = await SavingGoal.findById({ _id: goalId });
        // Find the transactions related to the goal
        const transactions = await NormalTransaction.find({ saving: goalId });
        // Calculate the current total amount
        const totalProgress = transactions.reduce((acc, curr) => acc + curr.amount, 0);
        const completeGoal = {
            name: savingGoal.name,
            color: savingGoal.color,
            icon: savingGoal.icon,
            description: savingGoal.description,
            target: savingGoal.target,
            startDate: savingGoal.startDate,
            endDate: savingGoal.endDate,
            status: savingGoal.status,
            totalProgress: totalProgress
        }
        res.status(200).json({ completeGoal, transactions });


    } catch (err) {
        next(new ErrorHandler(err.message, 404))
    }
}


exports.deleteGoal = async (req, res, next) => {
    const goalId = req.params.Id;
    try {
        const transactions = await NormalTransaction.find({ saving: goalId });
        // Remove all related transactions 
        await Promise.all(transactions.map(async (transaction) => {
            try {
                const deletedTransactions = await NormalTransaction.findByIdAndDelete(
                    transaction._id,
                );

                // Handle the updated transaction as needed
            } catch (err) {
                // Handle errors
                next(new ErrorHandler(err.message, 404));
            }
        }));

        // Delete the goal
        const deletedGoal = await SavingGoal.findByIdAndDelete(goalId);
        res.status(200).json('Goal successfully deleted');
    }
    catch (err) {
        next(new ErrorHandler(err.message, 500));
    }


}