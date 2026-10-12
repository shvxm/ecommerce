const express = require("express");

const {
  add,
  get,
  update,
  remove,
  clear
} = require("./cart.controller");

const {
  addToCartSchema,
  updateCartItemSchema
} = require("./cart.validation");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const validateMiddleware = require("../../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("USER"),
  validateMiddleware(addToCartSchema),
  add
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("USER"),
  get
);

router.patch(
  "/:productId",
  authMiddleware,
  roleMiddleware("USER"),
  validateMiddleware(updateCartItemSchema),
  update
);

router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware("USER"),
  remove
);

router.delete(
  "/",
  authMiddleware,
  roleMiddleware("USER"),
  clear
);

module.exports = router;