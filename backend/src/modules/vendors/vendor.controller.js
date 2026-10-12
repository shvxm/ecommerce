const {
  registerVendor,
  loginVendor,
  getVendorProfile,
  getVendorOrders,
  updateVendorOrderStatus
} = require("./vendor.service");

const register = async (req, res, next) => {
  try {
    const vendor = await registerVendor(req.body);

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully. Awaiting admin approval.",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const vendor = await loginVendor(req.body);

    res.status(200).json({
      success: true,
      message: "Vendor login successful",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const vendor = await getVendorProfile(req.user.vendorId);

    res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully",
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await getVendorOrders(
      req.user.vendorId
    );

    res.status(200).json({
      success: true,
      message: "Vendor orders fetched successfully",
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateVendorOrderStatus(
      req.params.id,
      req.user.vendorId,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getOrders,
  updateOrderStatus
};