const express = require("express");

const {
  createRazorpayOrderController,
  verifyRazorpayPaymentController,
} = require("./payment.controller");

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../../middleware/roleMiddleware"
);


const router =
  express.Router();


/*
 * Create Razorpay order
 */
router.post(
  "/create-order",
  authMiddleware,
  roleMiddleware("USER"),
  createRazorpayOrderController
);


/*
 * Verify Razorpay payment
 * and create ecommerce order
 */
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("USER"),
  verifyRazorpayPaymentController
);


module.exports = router;