const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("./cart.service");

const add = async (req, res, next) => {
  try {
    const cart = await addToCart(
      req.user.userId,
      req.body.productId,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const cart = await updateCartItem(
      req.user.userId,
      req.params.productId,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const cart = await removeFromCart(
      req.user.userId,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const clear = async (req, res, next) => {
  try {
    const cart = await clearCart(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  add,
  get,
  update,
  remove,
  clear
};