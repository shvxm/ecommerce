const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  description: z.string().optional()
});

const updateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").optional(),

  description: z.string().optional(),

  isActive: z.boolean().optional()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};