const Review = require("./review.model");
const Product = require("../products/product.model");
const Order = require("../orders/order.model");

const getProductReviews = async (
  productId
) => {
  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

const createReview = async (
  userId,
  productId,
  rating,
  comment
) => {
  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  const existingReview =
    await Review.findOne({
      user: userId,
      product: productId,
    });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product"
    );
  }

  const order =
    await Order.findOne({
      user: userId,
      "items.product": productId,
      status: "DELIVERED",
    });

  if (!order) {
    throw new Error(
      "You can review only products you have purchased and received"
    );
  }

  const review =
    await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

  return await review.populate(
    "user",
    "name"
  );
};

module.exports = {
  getProductReviews,
  createReview,
};