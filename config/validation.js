const { check } = require("express-validator");

exports.validRegister = [
  check("name", "Name is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage("name must be between 3 to 32 characters"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required")
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters"),
];

exports.validLogin = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "Password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters"),
];

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage("Password must contain at least 6 characters"),
];
