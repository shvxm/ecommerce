const {
  // Vendor services
  getPendingVendors,
  approveVendor,
  rejectVendor,
  getAllVendors,
  getVendorById,
  updateVendorStatus,

  // Order services
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  // User services
  getAllUsers,
  getUserById,
  updateUserStatus
} = require("./admin.service");


// ==========================================
// VENDOR CONTROLLERS
// ==========================================


// ------------------------------------------
// GET PENDING VENDORS
// ------------------------------------------

const getPendingVendorsController = async (
  req,
  res,
  next
) => {
  try {
    const vendors =
      await getPendingVendors();

    res.status(200).json({
      success: true,
      message:
        "Pending vendors fetched successfully",
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// APPROVE VENDOR
// ------------------------------------------

const approveVendorController = async (
  req,
  res,
  next
) => {
  try {
    const vendor =
      await approveVendor(req.params.id);

    res.status(200).json({
      success: true,
      message:
        "Vendor approved successfully",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// REJECT VENDOR
// ------------------------------------------

const rejectVendorController = async (
  req,
  res,
  next
) => {
  try {
    const vendor =
      await rejectVendor(req.params.id);

    res.status(200).json({
      success: true,
      message:
        "Vendor rejected successfully",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// GET ALL VENDORS
// ------------------------------------------

const getAllVendorsController = async (
  req,
  res,
  next
) => {
  try {
    const vendors =
      await getAllVendors();

    res.status(200).json({
      success: true,
      message:
        "Vendors fetched successfully",
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// GET VENDOR BY ID
// ------------------------------------------

const getVendorByIdController = async (
  req,
  res,
  next
) => {
  try {
    const vendor =
      await getVendorById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Vendor fetched successfully",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// ACTIVATE / DEACTIVATE VENDOR
// ------------------------------------------

const updateVendorStatusController = async (
  req,
  res,
  next
) => {
  try {
    const { isActive } = req.body;

    // Check that isActive is actually
    // true or false
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean"
      });
    }

    const vendor =
      await updateVendorStatus(
        req.params.id,
        isActive
      );

    res.status(200).json({
      success: true,
      message: isActive
        ? "Vendor activated successfully"
        : "Vendor deactivated successfully",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// USER CONTROLLERS
// ==========================================


// ------------------------------------------
// GET ALL USERS
// ------------------------------------------

const getAllUsersController = async (
  req,
  res,
  next
) => {
  try {
    const users =
      await getAllUsers();

    res.status(200).json({
      success: true,
      message:
        "Users fetched successfully",
      data: users
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// GET USER BY ID
// ------------------------------------------

const getUserByIdController = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await getUserById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "User fetched successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// ACTIVATE / DEACTIVATE USER
// ------------------------------------------

const updateUserStatusController = async (
  req,
  res,
  next
) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean"
      });
    }

    const user =
      await updateUserStatus(
        req.params.id,
        isActive
      );

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ORDER CONTROLLERS
// ==========================================


// ------------------------------------------
// GET ALL ORDERS
// ------------------------------------------

const getAllOrdersController = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await getAllOrders();

    res.status(200).json({
      success: true,
      message:
        "Orders fetched successfully",
      data: orders
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// GET ORDER BY ID
// ------------------------------------------

const getOrderByIdController = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await getOrderById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Order fetched successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};


// ------------------------------------------
// UPDATE ORDER STATUS
// ------------------------------------------

const updateOrderStatusController = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          "Order status is required"
      });
    }

    const order =
      await updateOrderStatus(
        req.params.id,
        status
      );

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  // Vendors
  getPendingVendorsController,
  approveVendorController,
  rejectVendorController,
  getAllVendorsController,
  getVendorByIdController,
  updateVendorStatusController,

  // Users
  getAllUsersController,
  getUserByIdController,
  updateUserStatusController,

  // Orders
  getAllOrdersController,
  getOrderByIdController,
  updateOrderStatusController
};