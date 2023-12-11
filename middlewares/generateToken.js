const jwt = require('jsonwebtoken');

const jwtGenerateToken = async function(id) {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

const generateToken = async function(user, statusCode, res) {
  const token = await jwtGenerateToken(user._id);
  
  // Configure options for the token cookie
  const options = {
    httpOnly: true, // The cookie cannot be accessed by client-side JavaScript
    expiresIn: new Date(Date.now() + process.env.EXPIRE_TOKEN) // Set the expiration date for the cookie
  };

  // Set the status code of the response and add the token cookie
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ token })
}

module.exports = {generateToken}