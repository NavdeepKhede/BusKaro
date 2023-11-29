const jwt = require("jsonwebtoken");
const User = require("../models/schemas/userSchema");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

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
