const express = require("express");
const { body } = require("express-validator");
const UserController = require("../controllers/userController");
const { validate } = require("../middlewares/validationMiddleware");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// User Registration
router.post(
  "/register",
  [
    body("email").notEmpty().isEmail(),
    body("number").notEmpty().isMobilePhone(),
    body("username").notEmpty().isAlphanumeric(),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  validate,
  UserController.register
);
// TODO: Update userSchema and add email, mobile field and get is in signup route
// User Login
router.post(
  "/login",
  [body("email").notEmpty().isEmail(), body("password").notEmpty()],
  validate,
  UserController.login
);

// User Profile (requires authentication)  TODO: check if authenticating or not. if not use authMiddleware
router.get("/profile", authenticateUser, UserController.getProfile);

module.exports = router;
