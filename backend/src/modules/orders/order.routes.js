const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");

const {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  cancelOrderController,
} = require("./order.controller");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createOrderController
);

router.get(
  "/",
  authMiddleware,
  getMyOrdersController
);

router.get(
  "/:id",
  authMiddleware,
  getOrderByIdController
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelOrderController
);

module.exports = router;