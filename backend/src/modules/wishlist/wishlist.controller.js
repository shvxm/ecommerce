const wishlistService = require("./wishlist.service");

const addToWishlistController = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.addToWishlist(
      req.user.userId,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const getWishlistController = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlistController = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.removeFromWishlist(
      req.user.userId,
      req.params.productId
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController,
};