const {
  getAdminDashboard
} = require("./admin.dashboard.service");

const getAdminDashboardController = async (req, res, next) => {
  try {
    const dashboard = await getAdminDashboard();

    res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully",
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardController
};