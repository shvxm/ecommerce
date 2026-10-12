const {
  getAllInventory,
  getLowStockProducts,
  updateInventoryByAdmin
} = require("./admin.inventory.service");

// Get all inventory
const getAllInventoryController = async (req, res, next) => {
  try {
    const inventory = await getAllInventory();

    res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// Get low stock products
const getLowStockController = async (req, res, next) => {
  try {
    const threshold = req.query.threshold
      ? Number(req.query.threshold)
      : 10;

    const products = await getLowStockProducts(threshold);

    res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully",
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Update inventory
const updateInventoryController = async (req, res, next) => {
  try {
    const product = await updateInventoryByAdmin(
      req.params.productId,
      req.body.stock
    );

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventoryController,
  getLowStockController,
  updateInventoryController
};