const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found. Redirecting to login.");
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, "shhhhh");
    console.log("Token verified. Checking user in database:", decoded);

    // Check if the user exists in the database
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.log("User not found in database. Redirecting to login.");
      return res.redirect('/auth/login');
    }

    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    console.error("Authentication failed. Redirecting to login:", err.message);
    return res.redirect('/auth/login');
  }
}

module.exports = authMiddleware;
