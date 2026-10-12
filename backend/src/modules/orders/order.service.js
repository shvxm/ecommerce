const Order = require("./order.model");
const Cart = require("../cart/cart.model");
const Product = require("../products/product.model");

const createOrder = async (
  userId,
  shippingAddress,
  paymentMethod,
  paymentId = null,
  razorpayOrderId = null
) => {
  /*
   * Find the user's cart.
   *
   * populate("items.product") loads
   * complete product information.
   */
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  /*
   * User cannot place an order
   * with an empty cart.
   */
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  /*
   * Only these payment methods
   * are allowed for new orders.
   */
  if (
    !["COD", "RAZORPAY"].includes(paymentMethod)
  ) {
    throw new Error(
      "Invalid payment method"
    );
  }

  const orderItems = [];

  let totalAmount = 0;

  /*
   * Verify every product in the cart
   * before creating the order.
   */
  for (const cartItem of cart.items) {
    const product = await Product.findById(
      cartItem.product._id
    );

    /*
     * Product must exist.
     */
    if (!product) {
      throw new Error(
        `Product ${cartItem.product._id} not found`
      );
    }

    /*
     * Product must be active.
     */
    if (!product.isActive) {
      throw new Error(
        `Product ${product.name} is not available`
      );
    }

    /*
     * Check available inventory.
     */
    if (
      product.stock < cartItem.quantity
    ) {
      throw new Error(
        `Insufficient stock for ${product.name}`
      );
    }

    /*
     * Calculate subtotal using
     * the current database price.
     */
    const subtotal =
      product.price *
      cartItem.quantity;

    /*
     * Create snapshot of the product
     * inside the order.
     */
    orderItems.push({
      product: product._id,
      vendor: product.vendor,
      quantity: cartItem.quantity,
      price: product.price,
      subtotal,
    });

    /*
     * Add item subtotal to
     * final order amount.
     */
    totalAmount += subtotal;
  }

  /*
   * COD payment is still pending
   * because money has not been received.
   *
   * Razorpay reaches this service
   * only after successful payment
   * verification.
   */
  const paymentStatus =
    paymentMethod === "RAZORPAY"
      ? "PAID"
      : "PENDING";

  /*
   * Create the actual order
   * in MongoDB.
   */
  const order = await Order.create({
    user: userId,

    items: orderItems,

    totalAmount,

    status: "PENDING",

    shippingAddress,

    paymentMethod,

    paymentStatus,

    paymentId,

    razorpayOrderId,
  });

  /*
   * Reduce product stock
   * after successful order creation.
   */
  for (const cartItem of cart.items) {
    await Product.findByIdAndUpdate(
      cartItem.product._id,
      {
        $inc: {
          stock: -cartItem.quantity,
        },
      }
    );
  }

  /*
   * Empty the user's cart
   * after the order has been created.
   */
  cart.items = [];

  await cart.save();

  return order;
};


/*
 * Get all orders belonging
 * to the currently logged-in user.
 */
const getMyOrders = async (userId) => {
  const orders = await Order.find({
    user: userId,
  })
    .populate(
      "items.product",
      "name price image"
    )
    .populate(
      "items.vendor",
      "businessName ownerName"
    )
    .sort({
      createdAt: -1,
    });

  return orders;
};


/*
 * Get one order.
 *
 * userId is also checked so that
 * one user cannot access another
 * user's order.
 */
const getOrderById = async (
  orderId,
  userId
) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate(
      "items.product",
      "name price image"
    )
    .populate(
      "items.vendor",
      "businessName ownerName"
    );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};


/*
 * Cancel an existing order.
 */
const cancelOrder = async (
  orderId,
  userId
) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  /*
   * Only pending and confirmed
   * orders can be cancelled.
   */
  if (
    order.status !== "PENDING" &&
    order.status !== "CONFIRMED"
  ) {
    throw new Error(
      "Order cannot be cancelled at this stage"
    );
  }

  /*
   * Return the ordered quantity
   * back to inventory.
   */
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          stock: item.quantity,
        },
      }
    );
  }

  order.status = "CANCELLED";

  await order.save();

  return order;
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};