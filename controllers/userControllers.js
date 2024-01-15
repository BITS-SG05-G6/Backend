const { generateToken } = require("../middlewares/generateToken");
const { hashPwd } = require("../middlewares/hash");
const User = require("../models/user");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const Category = require("../models/category");
const Wallet = require("../models/wallet");
const SavingGoal = require("../models/savingGoal");

exports.signup = async (req, res, next) => {
  const password = await hashPwd(req?.body?.password, next);
  const data = {
    username: req?.body?.username,
    password: password,
  };
  try {
    // const { username, password, email } = req.body;
    
    // Check if the username already exists
    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
      next(new ErrorHandler("Username had been existed", 404));
    }

    // Create a new user
    await User.create(data)
      .then(() => {
        res.status(200).json("Signup successfully");
      })
      .catch((err) => {
        next(new ErrorHandler(err.message, 404));
      });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username });

    // Check if the user exists
    if (!user) {
      next(new ErrorHandler("Invalid credentials", 404));
    }

    // Compare passwords
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      next(new ErrorHandler("Invalid credentials", 404));
    } else {
      generateToken(user, 200, res);
    }

    // Generate a JWT token
    // const token = jwt.sign({ userId: user._id }, "wise-wallet-key", {
    //   expiresIn: "1h",
    // });

    // res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

// Update account
exports.updateProfile = async (req, res, next) => {
  const data = {
    username: req?.body?.username,
    baseCurrency: req?.body?.baseCurrency, 
    password: req?.body?.password,
    rate: req?.body?.rate
  }

  try {   
    const hashedPassword = data.password ? await hashPwd(data.password, next) : null;
  
    if (data.baseCurrency != req.userID.baseCurrency) {
      const wallets = await Wallet.find({ user: req.userID }).catch((err) => {
        next(new ErrorHandler(err.message, 404));
      });

      wallets.map(async(wallet) => {
        let exchangeValue = 0;

        if (req.userID.baseCurrency === "VND") {
          exchangeValue = parseFloat((wallet.amount / data.rate).toFixed(2));
        } else {
          // console.log(wallet.amount * data.rate);
          exchangeValue = Math.floor(wallet.amount * data.rate);
        }

        await Wallet.findByIdAndUpdate(wallet._id, {
          amount: exchangeValue
        }, { new: true })
        // console.log("old: " + wallet.amount);
        // console.log(exchangeValue);
      });

      const categories = await Category.find({user: req.userID}).catch((err) => {
        next(new ErrorHandler(err.message, 404));
      });

      categories.map(async(category) => {
        let exchangeAmount;

        if (req.userID.baseCurrency === "VND") {
          // console.log(wallet.amount);
          exchangeAmount = parseFloat((category.budget / data.rate).toFixed(2));
        } else {
          // console.log(wallet.amount);
          exchangeAmount = category.budget * data.rate;
        }

        await Category.findByIdAndUpdate(category._id, {
          budget: exchangeAmount
        }, { new: true })

        // console.log("old: " + category.budget);
        // console.log(exchangeAmount);
      })

      const goals = await SavingGoal.find({user: req.userID}).catch((err) => {
        next(new ErrorHandler(err.message, 404));
      })

      goals.map(async(goal) => {
        let exchangeGoalValue;
        if (req.userID.baseCurrency === "VND") {
          // console.log(wallet.amount);
          exchangeGoalValue = parseFloat((goal.target / data.rate).toFixed(2));
        } else {
          // console.log(wallet.amount);
          exchangeGoalValue = goal.target * data.rate;
        }

        await SavingGoal.findByIdAndUpdate(goal._id, {
          target: exchangeGoalValue
        }, { new: true})

        console.log("old: " + goal.target);
        console.log("new: " + exchangeGoalValue);
      })
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.userID._id,
      {
        username: data.username,
        password: hashedPassword ? hashedPassword : req.userID.password,
        baseCurrency: data.baseCurrency,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new ErrorHandler("User not found", 404));
    }


    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    next(new ErrorHandler(err.message, 404));
  }
};

exports.signout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
  res.status(200).json({
    id: req.userID._id,
    username: req.userID.username,
    baseCurrency: req.userID.baseCurrency,
  });
};
