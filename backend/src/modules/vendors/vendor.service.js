const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Vendor = require("./vendor.model");

const Order = require("../orders/order.model");


// ========================================
// REGISTER VENDOR
// ========================================

const registerVendor = async ({
  businessName,
  ownerName,
  email,
  password,
  phone,
}) => {
  const existingVendor = await Vendor.findOne({
    email,
  });

  if (existingVendor) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const vendor = await Vendor.create({
    businessName,
    ownerName,
    email,
    password: hashedPassword,
    phone,
    status: "PENDING",

    // New vendors are active by default.
    // Admin can deactivate them later.
    isActive: true,
  });

  return {
    id: vendor._id,
    businessName: vendor.businessName,
    ownerName: vendor.ownerName,
    email: vendor.email,
    phone: vendor.phone,
    status: vendor.status,
    isActive: vendor.isActive,
  };
};


// ========================================
// LOGIN VENDOR
// ========================================

const loginVendor = async ({
  email,
  password,
}) => {
  const vendor = await Vendor.findOne({
    email,
  });

  if (!vendor) {
    throw new Error(
      "Invalid email or password"
    );
  }


  // Vendor must first be approved
  // by admin.
  if (vendor.status !== "APPROVED") {
    throw new Error(
      "Vendor account is awaiting admin approval"
    );
  }


  // Admin can deactivate an approved
  // vendor at any time.
  if (vendor.isActive === false) {
    throw new Error(
      "Vendor account is inactive. Please contact admin."
    );
  }


  const isPasswordValid =
    await bcrypt.compare(
      password,
      vendor.password
    );

  if (!isPasswordValid) {
    throw new Error(
      "Invalid email or password"
    );
  }


  const token = jwt.sign(
    {
      vendorId: vendor._id,
      role: "VENDOR",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );


  return {
    token,

    vendor: {
      id: vendor._id,
      businessName: vendor.businessName,
      ownerName: vendor.ownerName,
      email: vendor.email,
      phone: vendor.phone,
      role: "VENDOR",
      status: vendor.status,
      isActive: vendor.isActive,
    },
  };
};


// ========================================
// GET VENDOR PROFILE
// ========================================

const getVendorProfile = async (
  vendorId
) => {
  const vendor =
    await Vendor.findById(
      vendorId
    ).select("-password");

  if (!vendor) {
    throw new Error(
      "Vendor not found"
    );
  }

  return vendor;
};


// ========================================
// GET VENDOR ORDERS
// ========================================

const getVendorOrders = async (
  vendorId
) => {
  const orders =
    await Order.find({
      "items.vendor": vendorId,
    })
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.product",
        "name price image"
      )
      .populate(
        "items.vendor",
        "businessName ownerName"
      )
      .sort({
        createdAt: -1,
      });

  return orders;
};


// ========================================
// UPDATE VENDOR ORDER STATUS
// ========================================

const updateVendorOrderStatus =
  async (
    orderId,
    vendorId,
    status
  ) => {

    const order =
      await Order.findOne({
        _id: orderId,
        "items.vendor": vendorId,
      });


    if (!order) {
      throw new Error(
        "Order not found or you do not have access to this order"
      );
    }


    const allowedStatuses = [
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];


    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      throw new Error(
        "Invalid order status"
      );
    }


    order.status = status;

    await order.save();

    return order;
  };


// ========================================
// GET ALL VENDORS
// ADMIN
// ========================================

const getAllVendors =
  async () => {

    const vendors =
      await Vendor.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return vendors;
  };


// ========================================
// GET VENDOR BY ID
// ADMIN
// ========================================

const getVendorById =
  async (vendorId) => {

    const vendor =
      await Vendor.findById(
        vendorId
      ).select("-password");


    if (!vendor) {
      throw new Error(
        "Vendor not found"
      );
    }


    return vendor;
  };


// ========================================
// ACTIVATE / DEACTIVATE VENDOR
// ADMIN
// ========================================

const updateVendorStatus =
  async (
    vendorId,
    isActive
  ) => {

    const vendor =
      await Vendor.findById(
        vendorId
      );


    if (!vendor) {
      throw new Error(
        "Vendor not found"
      );
    }


    // Update vendor active status
    vendor.isActive = isActive;


    await vendor.save();


    // Return updated vendor
    // without password.
    const updatedVendor =
      await Vendor.findById(
        vendorId
      ).select("-password");


    return updatedVendor;
  };


// ========================================
// EXPORTS
// ========================================

module.exports = {

  registerVendor,

  loginVendor,

  getVendorProfile,

  getVendorOrders,

  updateVendorOrderStatus,

  getAllVendors,

  getVendorById,

  updateVendorStatus,

};