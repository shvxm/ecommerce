const { z } = require("zod");

const updateInventorySchema = z.object({
  stock: z.number().int().min(0, "Stock cannot be negative")
});

module.exports = {
  updateInventorySchema
};