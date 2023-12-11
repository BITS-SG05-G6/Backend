const { User } = require("../models/user");
const ErrorHandler = require ("../utils/ErrorHandler")

const userController ={
    //create a wallet
  createUser: async (req, res, next) => {
    try {
      const newUser = new User(req.body);
      const createdUser = await newUser.save();
      res.status(200).json({
        message: "User created successfully!",
        User: createdUser,
      });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },

  //view all wallet
  viewAllUser: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  },
  getAnUser: async(req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate("wallet");
      res.status(200).json(user)
    } catch (error) {
      next(new ErrorHandler(err.message, 500));
    }
  }
}

module.exports = userController;