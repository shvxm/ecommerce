const Product = require("../products/product.model");

// Get all inventory
const getAllInventory = async () => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("vendor", "businessName ownerName")
    .sort({ stock: 1 });

  return products.map((product) => ({
    id: product._id,
    name: product.name,
    stock: product.stock,
    category: product.category,
    vendor: product.vendor,
    isActive: product.isActive
  }));
};

// Get low stock products
const getLowStockProducts = async (threshold = 10) => {
  const products = await Product.find({
    stock: {
      $lte: threshold
    }
  })
    .populate("category", "name")
    .populate("vendor", "businessName ownerName")
    .sort({ stock: 1 });

  return products;
};

// Update product stock
const updateInventoryByAdmin = async (
  productId,
  stock
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  product.stock = stock;

  await product.save();

  return {
    id: product._id,
    name: product.name,
    stock: product.stock,
    vendor: product.vendor
  };
};

module.exports = {
  getAllInventory,
  getLowStockProducts,
  updateInventoryByAdmin
};