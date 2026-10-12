const express = require("express");

const {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController,
} = require("./wishlist.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("USER"),
  getWishlistController
);

router.post(
  "/:productId",
  authMiddleware,
  roleMiddleware("USER"),
  addToWishlistController
);

router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("USER"),
  removeFromWishlistController
);

module.exports = router;