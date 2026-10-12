const bcrypt = require("bcrypt");
const User = require("../users/user.model");
const generateToken = require("../../utils/generateToken");

// Register User
const registerUser = async ({ name, email, password }) => {
  // Check if email is already registered
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "USER",
    isActive: true
  });

  // Return user data without password
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

// Login User
const loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ email });

  // If user does not exist
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check whether account is active
  if (user.isActive === false) {
    throw new Error("Your account has been deactivated");
  }

  // Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  // If password is incorrect
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    role: user.role
  });

  // Return token and user information
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};