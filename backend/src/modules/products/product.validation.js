const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),

  description: z.string().min(
    5,
    "Description must be at least 5 characters"
  ),

  price: z.number().min(0, "Price cannot be negative"),

  stock: z.number().int().min(0, "Stock cannot be negative"),

  category: z.string().min(1, "Category is required"),

  image: z.string().optional()
});

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),

  description: z.string().min(5).optional(),

  price: z.number().min(0).optional(),

  stock: z.number().int().min(0).optional(),

  category: z.string().min(1).optional(),

  image: z.string().optional(),

  isActive: z.boolean().optional()
});

module.exports = {
  createProductSchema,
  updateProductSchema
};