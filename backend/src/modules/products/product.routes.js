const express = require("express");

const {
  getProductsController,
  getProductByIdController,
  getVendorProductsController,
  createProductController,
  updateProductController,
  deleteProductController,

  // ADMIN
  getAllProductsAdminController,
  updateProductAdminController,
  deleteProductAdminController,
  updateProductStatusAdminController

} = require("./product.controller");

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// PUBLIC
// ========================================

router.get(
  "/",
  getProductsController
);


// ========================================
// ADMIN
// ========================================

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllProductsAdminController
);

router.patch(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProductAdminController
);

router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteProductAdminController
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateProductStatusAdminController
);


// ========================================
// VENDOR
// ========================================

router.get(
  "/vendor",
  authMiddleware,
  roleMiddleware("VENDOR"),
  getVendorProductsController
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("VENDOR"),
  createProductController
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("VENDOR"),
  updateProductController
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("VENDOR"),
  deleteProductController
);


// ========================================
// SINGLE PRODUCT
// ========================================

router.get(
  "/:id",
  getProductByIdController
);


module.exports = router;