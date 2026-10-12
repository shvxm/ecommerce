const express = require("express");

const {
  register,
  login,
  getProfile
} = require("./auth.controller");

const {
  registerSchema,
  loginSchema
} = require("./auth.validation");

const validateMiddleware = require("../../middleware/validateMiddleware");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// PUBLIC ROUTES

router.post(
  "/register",
  validateMiddleware(registerSchema),
  register
);

router.post(
  "/login",
  validateMiddleware(loginSchema),
  login
);

// PROTECTED ROUTE

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// ADMIN TEST ROUTE

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin"
    });
  }
);

module.exports = router;