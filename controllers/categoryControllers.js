const Category = require("../models/category")
const ErrorHandler = require("../utils/ErrorHandler");
const NormalTransaction = require("../models/normalTransaction");

exports.createCategory = async(req, res, next) => {
  const data = {
    name: req?.body?.name,
    type: req?.body?.type,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.description,
    budget: req?.body?.budget === undefined ? 0 : req?.body?.budget,
    user: req.userID
  }

  try {
    const existedCategory = await Category.findOne({name: data.name, type: data.type});

    if (existedCategory) {
      return next (new ErrorHandler("Category had been existed", 404))
    } 

    await Category.create(data)
    .then(() => {
      res.status(200).json("Create category successfully")
    })
    .catch((err) => {
      next(new ErrorHandler(err.message, 404))
    })
  } catch (err) {
    next(new ErrorHandler(err.message, 404))
  }
}

exports.viewCategory = async(req, res, next) => {
  try {
    const categories = await (Category.find({user: req.userID}))
    res.status(200).json(categories);


  } catch (err) {
    next(new ErrorHandler(err.message, 404))
  }
}

exports.deleteCategory = async(req, res, next) => {
  const transactionList = await NormalTransaction.find({category: req.params.id})
  await Promise.all(transactionList.map(async (transaction) => {
    try {
      const updatedTransaction = await NormalTransaction.findByIdAndUpdate(
        transaction._id,
        { category: null }, // Set the category field to null
        { new: true }
      );
  
      // Handle the updated transaction as needed
    } catch (err) {
      // Handle errors
      next(new ErrorHandler(err.message, 404));
    }
  }));
  await Category.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json("Delete successfully")
  })
  .catch((err) => {
    next(new ErrorHandler(err.message, 404))
  })
}