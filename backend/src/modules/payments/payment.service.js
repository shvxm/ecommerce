
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Cart = require("../cart/cart.model");
const Product = require("../products/product.model");
const { createOrder } = require("../orders/order.service");

// Create Razorpay instance only when required
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys missing. Check Render Environment Variables."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// CREATE RAZORPAY ORDER
const createRazorpayOrder = async (userId) => {
  try {
    const razorpay = getRazorpayInstance();

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    for (const cartItem of cart.items) {
      if (!cartItem.product) {
        throw new Error("Product in cart was not found");
      }

      const product = await Product.findById(
        cartItem.product._id
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (!product.isActive) {
        throw new Error(`${product.name} is not available`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }

      const subtotal = product.price * cartItem.quantity;
      totalAmount += subtotal;
    }

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new Error("Invalid order amount");
    }

    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise <= 0) {
      throw new Error("Invalid Razorpay amount");
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error("Razorpay order was not created");
    }

    return {
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error(
      "Razorpay order creation failed:",
      error?.error?.description || error?.message || error
    );

    throw error;
  }
};

// VERIFY RAZORPAY PAYMENT
const verifyRazorpayPayment = async ({
  userId,
  shippingAddress,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("Razorpay Key Secret is missing");
  }

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    throw new Error("Required payment details are missing");
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest();

  // Reject malformed signatures before comparing
  if (!/^[a-f0-9]{64}$/i.test(razorpaySignature)) {
    throw new Error("Payment verification failed");
  }

  const receivedSignature = Buffer.from(
    razorpaySignature,
    "hex"
  );

  if (
    !crypto.timingSafeEqual(
      generatedSignature,
      receivedSignature
    )
  ) {
    throw new Error("Payment verification failed");
  }

  const order = await createOrder(
    userId,
    shippingAddress,
    "RAZORPAY",
    razorpayPaymentId,
    razorpayOrderId
  );

  return order;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
