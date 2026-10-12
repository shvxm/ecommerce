const { registerUser, loginUser } = require("./auth.service");
const User = require("../users/user.model");
const asyncHandler = require("../../utils/asyncHandler");

// Register User
const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user
  });
});

// Login User
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

// Get User Profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: user
  });
});

module.exports = {
  register,
  login,
  getProfile
};