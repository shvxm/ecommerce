const Razorpay = require("razorpay");
const crypto = require("crypto");

const Cart = require("../cart/cart.model");
const Product = require("../products/product.model");

const {
  createOrder,
} = require("../orders/order.service");


// =====================================================
// RAZORPAY INSTANCE
// =====================================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createRazorpayOrder = async (userId) => {
  try {

    // -------------------------------------------------
    // CHECK RAZORPAY CONFIGURATION
    // -------------------------------------------------

    if (!process.env.RAZORPAY_KEY_ID) {
      throw new Error(
        "Razorpay Key ID is missing"
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay Key Secret is missing"
      );
    }


    // -------------------------------------------------
    // FIND USER CART
    // -------------------------------------------------

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");


    // -------------------------------------------------
    // CHECK CART
    // -------------------------------------------------

    if (!cart) {
      throw new Error(
        "Cart not found"
      );
    }


    if (
      !cart.items ||
      cart.items.length === 0
    ) {
      throw new Error(
        "Cart is empty"
      );
    }


    // -------------------------------------------------
    // CALCULATE TOTAL FROM DATABASE
    // -------------------------------------------------

    let totalAmount = 0;


    for (
      const cartItem of cart.items
    ) {

      // Product reference missing
      if (!cartItem.product) {
        throw new Error(
          "Product in cart was not found"
        );
      }


      // Find latest product data
      const product =
        await Product.findById(
          cartItem.product._id
        );


      if (!product) {
        throw new Error(
          "Product not found"
        );
      }


      // ------------------------------------------------
      // PRODUCT ACTIVE CHECK
      // ------------------------------------------------

      if (!product.isActive) {
        throw new Error(
          `${product.name} is not available`
        );
      }


      // ------------------------------------------------
      // STOCK CHECK
      // ------------------------------------------------

      if (
        product.stock <
        cartItem.quantity
      ) {
        throw new Error(
          `Insufficient stock for ${product.name}`
        );
      }


      // ------------------------------------------------
      // PRICE CALCULATION
      // ------------------------------------------------

      const subtotal =
        product.price *
        cartItem.quantity;


      totalAmount += subtotal;
    }


    // -------------------------------------------------
    // VALIDATE TOTAL
    // -------------------------------------------------

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      throw new Error(
        "Invalid order amount"
      );
    }


    // -------------------------------------------------
    // CONVERT RUPEES TO PAISE
    // -------------------------------------------------

    const amountInPaise =
      Math.round(
        totalAmount * 100
      );


    if (amountInPaise <= 0) {
      throw new Error(
        "Invalid Razorpay amount"
      );
    }


    // -------------------------------------------------
    // RECEIPT
    // -------------------------------------------------

    const receipt =
      `receipt_${Date.now()}`;


    // -------------------------------------------------
    // CREATE RAZORPAY ORDER
    // -------------------------------------------------

    const razorpayOrder =
      await razorpay.orders.create({

        amount:
          amountInPaise,

        currency:
          "INR",

        receipt:
          receipt,
      });


    // -------------------------------------------------
    // CHECK RESPONSE
    // -------------------------------------------------

    if (
      !razorpayOrder ||
      !razorpayOrder.id
    ) {
      throw new Error(
        "Razorpay order was not created"
      );
    }


    // -------------------------------------------------
    // RETURN DATA TO FRONTEND
    // -------------------------------------------------

    return {

      id:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      key:
        process.env.RAZORPAY_KEY_ID,
    };

  } catch (error) {

    console.error(
      "Razorpay order creation failed:"
    );

    console.error(
      error?.error?.description ||
      error?.message ||
      error
    );


    // Razorpay API error
    if (
      error?.error?.description
    ) {
      throw new Error(
        error.error.description
      );
    }


    // Normal application error
    throw error;
  }
};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyRazorpayPayment = async ({
  userId,
  shippingAddress,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {

  // ---------------------------------------------------
  // VALIDATE PAYMENT DATA
  // ---------------------------------------------------

  if (!razorpayOrderId) {
    throw new Error(
      "Razorpay order ID is required"
    );
  }


  if (!razorpayPaymentId) {
    throw new Error(
      "Razorpay payment ID is required"
    );
  }


  if (!razorpaySignature) {
    throw new Error(
      "Razorpay signature is required"
    );
  }


  // ---------------------------------------------------
  // GENERATE SIGNATURE
  // ---------------------------------------------------

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
      )
      .digest("hex");


  // ---------------------------------------------------
  // COMPARE SIGNATURES
  // ---------------------------------------------------

  const signaturesMatch =
    crypto.timingSafeEqual(
      Buffer.from(
        generatedSignature
      ),
      Buffer.from(
        razorpaySignature
      )
    );


  if (!signaturesMatch) {
    throw new Error(
      "Payment verification failed"
    );
  }


  // ---------------------------------------------------
  // CREATE OUR E-COMMERCE ORDER
  // ---------------------------------------------------

  const order =
    await createOrder(
      userId,

      shippingAddress,

      "RAZORPAY",

      razorpayPaymentId,

      razorpayOrderId
    );


  // ---------------------------------------------------
  // RETURN ORDER
  // ---------------------------------------------------

  return order;
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};