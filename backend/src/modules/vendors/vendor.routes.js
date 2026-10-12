const express = require("express");

const {
  register,
  login,
  getProfile,
  getOrders,
  updateOrderStatus
} = require("./vendor.controller");

const {
  getVendorDashboardController
} = require("./vendor.dashboard.controller");

const {
  updateInventoryController
} = require("./vendor.inventory.controller");

const validateMiddleware = require("../../middleware/validateMiddleware");

const {
  updateInventorySchema
} = require("./vendor.inventory.validation");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// PUBLIC VENDOR ROUTES
// ========================================

// Vendor Registration
router.post(
  "/register",
  register
);

// Vendor Login
router.post(
  "/login",
  login
);

// ========================================
// VENDOR PROTECTED ROUTES
// ========================================

// Vendor Profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("VENDOR"),
  getProfile
);

// Vendor Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("VENDOR"),
  getVendorDashboardController
);

// ========================================
// VENDOR INVENTORY ROUTES
// ========================================

// Update Product Inventory
router.patch(
  "/inventory/:productId",
  authMiddleware,
  roleMiddleware("VENDOR"),
  validateMiddleware(updateInventorySchema),
  updateInventoryController
);

// ========================================
// VENDOR ORDER ROUTES
// ========================================

// Get Vendor Orders
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("VENDOR"),
  getOrders
);

// Update Vendor Order Status
router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware("VENDOR"),
  updateOrderStatus
);

module.exports = router;