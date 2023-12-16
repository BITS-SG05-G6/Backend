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
  try {
    const categories = await (Category.find({user: req.userID, type: categoryType}))
    const a = await Promise.all(categories.map(async(category) => {
      // console.log(category.name);
      const transactions = await NormalTransaction.find({user: req.userID, category: category})
      let amount = 0;
      transactions.map((transaction) => {
        amount += transaction.amount;
      })

      return {
        id: category._id,
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        amount: amount
      }
    }))

    // console.log(a)

    res.status(200).json(a);


    // const amount = await NormalTransaction.find({user: req.UserID, category: })
  } catch (err) {
    next(new ErrorHandler(err.message, 404))
  }
  
  // .then((categories) => {
  //   res.status(200).json(categories)
  // })
  // .catch((err) => {
  //   next(new ErrorHandler(err.message, 404))
  // })
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