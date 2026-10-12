const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,

  // ADMIN
  getAllProductsAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  updateProductStatusAdmin

} = require("./product.service");


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProductsController = async (
  req,
  res,
  next
) => {
  try {

    const products = await getProducts(
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// GET SINGLE PRODUCT
// ========================================

const getProductByIdController = async (
  req,
  res,
  next
) => {
  try {

    const product =
      await getProductById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// GET VENDOR PRODUCTS
// ========================================

const getVendorProductsController = async (
  req,
  res,
  next
) => {
  try {

    const products =
      await getVendorProducts(
        req.user.vendorId
      );

    res.status(200).json({
      success: true,
      message: "Vendor products fetched successfully",
      data: products
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProductController = async (
  req,
  res,
  next
) => {
  try {

    const product =
      await createProduct(
        req.body,
        req.user.vendorId
      );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProductController = async (
  req,
  res,
  next
) => {
  try {

    const product =
      await updateProduct(
        req.params.id,
        req.body,
        req.user.vendorId
      );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProductController = async (
  req,
  res,
  next
) => {
  try {

    const product =
      await deleteProduct(
        req.params.id,
        req.user.vendorId
      );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }
};

// ========================================
// ADMIN - GET ALL PRODUCTS
// ========================================

const getAllProductsAdminController = async (
  req,
  res,
  next
) => {

  try {

    const products =
      await getAllProductsAdmin();

    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      data: products
    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// ADMIN - UPDATE PRODUCT
// ========================================

const updateProductAdminController = async (
  req,
  res,
  next
) => {

  try {

    const product =
      await updateProductAdmin(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// ADMIN - DELETE PRODUCT
// ========================================

const deleteProductAdminController = async (
  req,
  res,
  next
) => {

  try {

    const product =
      await deleteProductAdmin(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }

};


// ========================================
// ADMIN - UPDATE PRODUCT STATUS
// ========================================

const updateProductStatusAdminController = async (
  req,
  res,
  next
) => {

  try {

    const product =
      await updateProductStatusAdmin(
        req.params.id,
        req.body.isActive
      );

    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: product
    });

  } catch (error) {

    next(error);

  }

};


module.exports = {
  getProductsController,
  getProductByIdController,

  getVendorProductsController,
  createProductController,
  updateProductController,
  deleteProductController,

  // ADMIN
  getAllProductsAdminController,
  updateProductAdminController,
  deleteProductAdminController,
  updateProductStatusAdminController
};