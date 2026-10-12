const express = require("express");

const {
  getProfileController,
  updateProfileController,
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController
} = require("./user.controller");

const authMiddleware = require("../../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// PROFILE
// ==========================================

router.get(
  "/profile",
  authMiddleware,
  getProfileController
);

router.patch(
  "/profile",
  authMiddleware,
  updateProfileController
);


// ==========================================
// ADDRESSES
// ==========================================

router.get(
  "/addresses",
  authMiddleware,
  getAddressesController
);

router.post(
  "/addresses",
  authMiddleware,
  addAddressController
);

router.patch(
  "/addresses/:id",
  authMiddleware,
  updateAddressController
);

router.delete(
  "/addresses/:id",
  authMiddleware,
  deleteAddressController
);

router.patch(
  "/addresses/:id/default",
  authMiddleware,
  setDefaultAddressController
);


module.exports = router;