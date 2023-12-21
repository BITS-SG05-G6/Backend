const User = require("../models/user")
const jwt = require("jsonwebtoken");
// const ErrorResponse = require("../utils/errorResponse");

// Exports a check authenticated function
exports.isAuthenticated = async (req, res, next) => {
  // console.log(req.headers.authorization)
  // return res.status(401).json({message: "You must login", data: ""});

  try {
    const token = req.headers.authorization;
    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: "You must login", data: token });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Decode the token to get the customer id
    req.userID = await User.findById(decode.id);
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "You must login" });
  }
};
