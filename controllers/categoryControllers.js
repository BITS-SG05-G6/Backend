const Category = require("../models/category")
const ErrorHandler = require("../utils/ErrorHandler");

exports.createCategory = async(req, res, next) => {
  const data = {
    name: req?.body?.name,
    type: req?.body?.type,
    color: req?.body?.color,
    icon: req?.body?.icon,
    description: req?.body?.description,
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
  const categoryType = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
  await Category.find({user: req.userID, type: categoryType})
  .then((categories) => {
    res.status(200).json(categories)
  })
  .catch((err) => {
    next(new ErrorHandler(err.message, 404))
  })
}

exports.deleteCategory = async(req, res, next) => {
  await Category.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(200).json("Delete successfully")
  })
  .catch((err) => {
    next(new ErrorHandler(err.message, 404))
  })
}