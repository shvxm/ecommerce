const { z } = require("zod");

const vendorRegisterSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),

  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string().min(10, "Phone number must be at least 10 characters")
});

const vendorLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

module.exports = {
  vendorRegisterSchema,
  vendorLoginSchema
};