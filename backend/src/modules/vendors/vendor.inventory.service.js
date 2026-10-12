const Product = require("../products/product.model");

const updateVendorInventory = async (
  productId,
  vendorId,
  stock
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.vendor.toString() !== vendorId.toString()) {
    throw new Error(
      "You do not have permission to update this product inventory"
    );
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
  updateVendorInventory
};