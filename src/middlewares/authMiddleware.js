const jwt = require("jsonwebtoken");
const User = require("../models/schemas/userSchema");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  console.log("TOKEN_IN_AUTH_MIDDLEWARE_TO_VERIFIED:", token);

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("TOKEN_IN_AUTH_MIDDLEWARE_DECODED:", decoded);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized. Admin access required" });
  }
  next();
};

module.exports = { authenticateUser, checkAdminRole };
