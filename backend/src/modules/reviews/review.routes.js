const express = require("express");

const {
  getProductReviewsController,
  createReviewController,
} = require("./review.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/product/:productId",
  getProductReviewsController
);

router.post(
  "/:productId",
  authMiddleware,
  roleMiddleware("USER"),
  createReviewController
);

module.exports = router;