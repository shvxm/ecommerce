const express = require("express");

const {
  create,
  getAll,
  getOne,
  update,
  remove
} = require("./category.controller");

const {
  createCategorySchema,
  updateCategorySchema
} = require("./category.validation");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const validateMiddleware = require("../../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateMiddleware(createCategorySchema),
  create
);

router.get(
  "/",
  getAll
);

router.get(
  "/:id",
  getOne
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateMiddleware(updateCategorySchema),
  update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  remove
);

module.exports = router;