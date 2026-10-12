const Vendor = require("../vendors/vendor.model");
const Order = require("../orders/order.model");
const User = require("../users/user.model");


// ==========================================
// GET PENDING VENDORS
// ==========================================

const getPendingVendors = async () => {
  const vendors = await Vendor.find({
    status: "PENDING"
  })
    .select("-password")
    .sort({ createdAt: -1 });

  return vendors;
};


// ==========================================
// APPROVE VENDOR
// ==========================================

const approveVendor = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "APPROVED") {
    throw new Error("Vendor is already approved");
  }

  vendor.status = "APPROVED";

  // Approved vendor becomes active
  vendor.isActive = true;

  await vendor.save();

  return {
    id: vendor._id,
    businessName: vendor.businessName,
    ownerName: vendor.ownerName,
    email: vendor.email,
    phone: vendor.phone,
    status: vendor.status,
    isActive: vendor.isActive
  };
};


// ==========================================
// REJECT VENDOR
// ==========================================

const rejectVendor = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (vendor.status === "REJECTED") {
    throw new Error("Vendor is already rejected");
  }

  vendor.status = "REJECTED";

  // Rejected vendor becomes inactive
  vendor.isActive = false;

  await vendor.save();

  return {
    id: vendor._id,
    businessName: vendor.businessName,
    ownerName: vendor.ownerName,
    email: vendor.email,
    phone: vendor.phone,
    status: vendor.status,
    isActive: vendor.isActive
  };
};


// ==========================================
// GET ALL VENDORS
// ==========================================

const getAllVendors = async () => {
  const vendors = await Vendor.find({})
    .select("-password")
    .sort({ createdAt: -1 });

  return vendors;
};


// ==========================================
// GET VENDOR BY ID
// ==========================================

const getVendorById = async (vendorId) => {
  const vendor = await Vendor.findById(vendorId)
    .select("-password");

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return vendor;
};


// ==========================================
// ACTIVATE / DEACTIVATE VENDOR
// ==========================================

const updateVendorStatus = async (
  vendorId,
  isActive
) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  // Rejected vendor cannot be activated
  if (
    vendor.status === "REJECTED" &&
    isActive === true
  ) {
    throw new Error(
      "Rejected vendor cannot be activated"
    );
  }

  vendor.isActive = isActive;

  await vendor.save();

  return {
    id: vendor._id,
    businessName: vendor.businessName,
    ownerName: vendor.ownerName,
    email: vendor.email,
    phone: vendor.phone,
    status: vendor.status,
    isActive: vendor.isActive
  };
};


// ==========================================
// GET ALL ORDERS
// ==========================================

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate(
      "items.product",
      "name price image"
    )
    .populate(
      "items.vendor",
      "businessName ownerName"
    )
    .sort({ createdAt: -1 });

  return orders;
};


// ==========================================
// GET ORDER BY ID
// ==========================================

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate(
      "items.product",
      "name price image"
    )
    .populate(
      "items.vendor",
      "businessName ownerName"
    );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (
  orderId,
  status
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  order.status = status;

  await order.save();

  return order;
};


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async () => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  return users;
};


// ==========================================
// GET USER BY ID
// ==========================================

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


// ==========================================
// ACTIVATE / DEACTIVATE USER
// ==========================================

const updateUserStatus = async (
  userId,
  isActive
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Admin cannot be deactivated
  if (user.role === "ADMIN") {
    throw new Error(
      "Admin account status cannot be changed"
    );
  }

  user.isActive = isActive;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  };
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // Vendors
  getPendingVendors,
  approveVendor,
  rejectVendor,
  getAllVendors,
  getVendorById,
  updateVendorStatus,

  // Orders
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  // Users
  getAllUsers,
  getUserById,
  updateUserStatus
};