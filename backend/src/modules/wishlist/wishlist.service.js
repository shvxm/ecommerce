const Wishlist = require("./wishlist.model");
const Product = require("../products/product.model");

const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isActive) {
    throw new Error("Product is not available");
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });

    return wishlist.populate("products");
  }

  const alreadyExists = wishlist.products.some(
    (id) => id.toString() === productId.toString()
  );

  if (alreadyExists) {
    throw new Error("Product already exists in wishlist");
  }

  wishlist.products.push(productId);

  await wishlist.save();

  return wishlist.populate("products");
};

const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products"
  );

  if (!wishlist) {
    return {
      user: userId,
      products: [],
    };
  }

  return wishlist;
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId.toString()
  );

  await wishlist.save();

  return wishlist.populate("products");
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};