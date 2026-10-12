const {
  getVendorDashboard
} = require("./vendor.dashboard.service");

const getVendorDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getVendorDashboard(
      req.user.vendorId
    );

    res.status(200).json({
      success: true,
      message: "Vendor dashboard fetched successfully",
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendorDashboardController
};