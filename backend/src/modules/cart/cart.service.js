const Cart = require("./cart.model");
const Product = require("../products/product.model");

const addToCart = async (userId, productId, quantity) => {
  // Quantity must be greater than 0
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Find the product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Product must be active
  if (!product.isActive) {
    throw new Error("Product is not available");
  }

  // Check available stock
  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  // Find user's cart
  let cart = await Cart.findOne({
    user: userId
  });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity
        }
      ]
    });

    return cart;
  }

  // Check whether product already exists in cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  // If product already exists
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    // Check stock for total cart quantity
    if (newQuantity > product.stock) {
      throw new Error("Insufficient stock");
    }

    existingItem.quantity = newQuantity;
  } else {
    // Add new product to cart
    cart.items.push({
      product: productId,
      quantity
    });
  }

  // Save cart
  await cart.save();

  return cart;
};

const getCart = async (userId) => {
  // Find user's cart and populate product details
  const cart = await Cart.findOne({
    user: userId
  }).populate(
    "items.product",
    "name price stock image isActive"
  );

  // If cart doesn't exist, return empty cart
  if (!cart) {
    return {
      user: userId,
      items: [],
      totalItems: 0,
      totalAmount: 0
    };
  }

  let totalItems = 0;
  let totalAmount = 0;

  // Calculate cart totals
  cart.items.forEach((item) => {
    totalItems += item.quantity;

    totalAmount +=
      item.quantity * item.product.price;
  });

  return {
    id: cart._id,
    user: cart.user,
    items: cart.items,
    totalItems,
    totalAmount
  };
};

const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  // Quantity must be greater than 0
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Find user's cart
  const cart = await Cart.findOne({
    user: userId
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find item inside cart
  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    throw new Error("Product not found in cart");
  }

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Product must be active
  if (!product.isActive) {
    throw new Error("Product is not available");
  }

  // Check current stock
  if (quantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  // Update ONLY cart quantity
  item.quantity = quantity;

  // Save cart
  await cart.save();

  return cart;
};

const removeFromCart = async (
  userId,
  productId
) => {
  // Find user's cart
  const cart = await Cart.findOne({
    user: userId
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Check whether product exists in cart
  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );

  if (!itemExists) {
    throw new Error("Product not found in cart");
  }

  // Remove product from cart
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  // Save cart
  await cart.save();

  return cart;
};

const clearCart = async (userId) => {
  // Find user's cart
  const cart = await Cart.findOne({
    user: userId
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Remove all items from cart
  cart.items = [];

  // Save cart
  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};