const {
  updateVendorInventory
} = require("./vendor.inventory.service");

const updateInventoryController = async (req, res, next) => {
  try {
    const product = await updateVendorInventory(
      req.params.productId,
      req.user.vendorId,
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
  updateInventoryController
};