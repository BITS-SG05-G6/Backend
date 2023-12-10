// Login and Sign Up Error Hanling
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate key error";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
