const express = require("express");


// ==========================================
// ADMIN CONTROLLERS
// ==========================================

const {
  // Vendors
  getPendingVendorsController,
  approveVendorController,
  rejectVendorController,
  getAllVendorsController,
  getVendorByIdController,
  updateVendorStatusController,

  // Users
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,

  // Orders
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController
} = require("./admin.controller");


// ==========================================
// INVENTORY CONTROLLERS
// ==========================================

const {
  getAllInventoryController,
  getLowStockController,
  updateInventoryController
} = require("./admin.inventory.controller");


// ==========================================
// DASHBOARD CONTROLLER
// ==========================================

const {
  getAdminDashboardController
} = require("./admin.dashboard.controller");


// ==========================================
// MIDDLEWARE
// ==========================================

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");


// ==========================================
// ROUTER
// ==========================================

const router = express.Router();


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAdminDashboardController
);


// ==========================================
// ADMIN VENDOR MANAGEMENT
// ==========================================


// GET ALL VENDORS

router.get(
  "/vendors",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllVendorsController
);


// GET PENDING VENDORS

router.get(
  "/vendors/pending",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getPendingVendorsController
);


// GET SINGLE VENDOR

router.get(
  "/vendors/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getVendorByIdController
);


// APPROVE VENDOR

router.patch(
  "/vendors/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  approveVendorController
);


// REJECT VENDOR

router.patch(
  "/vendors/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  rejectVendorController
);


// ACTIVATE / DEACTIVATE VENDOR

router.patch(
  "/vendors/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateVendorStatusController
);


// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================


// GET ALL USERS

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllUsersController
);


// GET USER BY ID

router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserByIdController
);


// ACTIVATE / DEACTIVATE USER

router.patch(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateUserStatusController
);


// ==========================================
// ADMIN ORDER MANAGEMENT
// ==========================================


// GET ALL ORDERS

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllOrdersController
);


// GET ORDER BY ID

router.get(
  "/orders/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getOrderByIdController
);


// UPDATE ORDER STATUS

router.patch(
  "/orders/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateOrderStatusController
);


// ==========================================
// ADMIN INVENTORY MANAGEMENT
// ==========================================


// GET ALL INVENTORY

router.get(
  "/inventory",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllInventoryController
);


// GET LOW STOCK PRODUCTS

router.get(
  "/inventory/low-stock",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getLowStockController
);


// UPDATE INVENTORY

router.patch(
  "/inventory/:productId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateInventoryController
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;