require("dotenv").config();

const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../modules/users/user.model");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@ecommerce.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "E-Commerce Admin",
      email: "admin@ecommerce.com",
      password: hashedPassword,
      role: "ADMIN"
    });

    console.log("Admin created successfully");
    console.log({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();