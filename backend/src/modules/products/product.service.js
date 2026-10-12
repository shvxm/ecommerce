const mongoose = require("mongoose");

const Product = require("./product.model");
const Vendor = require("../vendors/vendor.model");


// ========================================
// GET ACTIVE VENDOR IDS
// ========================================

const getActiveVendorIds = async () => {
  const activeVendors = await Vendor.find({
    status: "APPROVED",
    isActive: true
  }).select("_id");

  return activeVendors.map(
    (vendor) => vendor._id
  );
};


// ========================================
// GET ALL PRODUCTS
// USER SIDE
// ========================================

const getProducts = async (query) => {

  // --------------------------------------
  // GET ACTIVE VENDORS
  // --------------------------------------

  const activeVendorIds =
    await getActiveVendorIds();


  // --------------------------------------
  // BASE FILTER
  // --------------------------------------

  const filter = {
    isActive: true,

    // Product vendor must be active
    vendor: {
      $in: activeVendorIds
    }
  };


  // ======================================
  // SEARCH
  // ======================================

  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i"
    };
  }


  // ======================================
  // CATEGORY
  // ======================================

  if (query.category) {
    filter.category = query.category;
  }


  // ======================================
  // MIN PRICE
  // ======================================

  if (query.minPrice) {
    filter.price = {
      ...filter.price,
      $gte: Number(query.minPrice)
    };
  }


  // ======================================
  // MAX PRICE
  // ======================================

  if (query.maxPrice) {
    filter.price = {
      ...filter.price,
      $lte: Number(query.maxPrice)
    };
  }


  // ======================================
  // IN STOCK
  // ======================================

  if (query.inStock === "true") {
    filter.stock = {
      $gt: 0
    };
  }


  // ======================================
  // SORT
  // ======================================

  let sort = {
    createdAt: -1
  };


  if (query.sort === "price-low") {
    sort = {
      price: 1
    };
  }


  if (query.sort === "price-high") {
    sort = {
      price: -1
    };
  }


  if (query.sort === "oldest") {
    sort = {
      createdAt: 1
    };
  }


  // ======================================
  // GET PRODUCTS
  // ======================================

  const products =
    await Product.find(filter)
      .populate(
        "category",
        "name"
      )
      .populate(
        "vendor",
        "businessName ownerName status isActive"
      )
      .sort(sort);


  return products;
};


// ========================================
// GET SINGLE PRODUCT
// USER SIDE
// ========================================

const getProductById = async (
  productId
) => {

  // --------------------------------------
  // VALIDATE PRODUCT ID
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }


  // --------------------------------------
  // FIND PRODUCT
  // --------------------------------------

  const product =
    await Product.findById(
      productId
    )
      .populate(
        "category",
        "name"
      )
      .populate(
        "vendor",
        "businessName ownerName status isActive"
      );


  // --------------------------------------
  // PRODUCT NOT FOUND
  // --------------------------------------

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }


  // --------------------------------------
  // PRODUCT INACTIVE
  // --------------------------------------

  if (!product.isActive) {
    throw new Error(
      "Product is not available"
    );
  }


  // --------------------------------------
  // VENDOR CHECK
  // --------------------------------------

  if (
    !product.vendor ||
    product.vendor.status !== "APPROVED" ||
    product.vendor.isActive !== true
  ) {
    throw new Error(
      "Product is not available"
    );
  }


  return product;
};


// ========================================
// GET VENDOR PRODUCTS
// VENDOR SIDE
// ========================================

const getVendorProducts = async (
  vendorId
) => {

  // --------------------------------------
  // VALIDATE VENDOR ID
  // --------------------------------------

  if (
    !vendorId ||
    !mongoose.Types.ObjectId.isValid(
      vendorId
    )
  ) {
    throw new Error(
      "Invalid vendor ID"
    );
  }


  // --------------------------------------
  // GET PRODUCTS
  // --------------------------------------

  const products =
    await Product.find({
      vendor: vendorId
    })
      .populate(
        "category",
        "name"
      )
      .populate(
        "vendor",
        "businessName ownerName status isActive"
      )
      .sort({
        createdAt: -1
      });


  return products;
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (
  data,
  vendorId
) => {

  // --------------------------------------
  // VALIDATE VENDOR ID
  // --------------------------------------

  if (
    !vendorId ||
    !mongoose.Types.ObjectId.isValid(
      vendorId
    )
  ) {
    throw new Error(
      "Invalid vendor ID"
    );
  }


  // --------------------------------------
  // CHECK VENDOR
  // --------------------------------------

  const vendor =
    await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error(
      "Vendor not found"
    );
  }


  if (vendor.status !== "APPROVED") {
    throw new Error(
      "Vendor is not approved"
    );
  }


  if (vendor.isActive !== true) {
    throw new Error(
      "Vendor account is inactive"
    );
  }


  // --------------------------------------
  // DATA
  // --------------------------------------

  const {
    name,
    description,
    price,
    stock,
    category,
    image
  } = data;


  // --------------------------------------
  // NAME VALIDATION
  // --------------------------------------

  if (!name) {
    throw new Error(
      "Product name is required"
    );
  }


  // --------------------------------------
  // PRICE VALIDATION
  // --------------------------------------

  if (
    price === undefined ||
    Number(price) < 0
  ) {
    throw new Error(
      "Valid product price is required"
    );
  }


  // --------------------------------------
  // STOCK VALIDATION
  // --------------------------------------

  if (
    stock === undefined ||
    Number(stock) < 0
  ) {
    throw new Error(
      "Valid product stock is required"
    );
  }


  // --------------------------------------
  // CREATE PRODUCT
  // --------------------------------------

  const product =
    await Product.create({

      name,

      description,

      price: Number(price),

      stock: Number(stock),

      category,

      image,

      vendor: vendorId,

      isActive: true

    });


  return product;
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (
  productId,
  data,
  vendorId
) => {

  // --------------------------------------
  // VALIDATE PRODUCT ID
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }


  // --------------------------------------
  // VALIDATE VENDOR ID
  // --------------------------------------

  if (
    !vendorId ||
    !mongoose.Types.ObjectId.isValid(
      vendorId
    )
  ) {
    throw new Error(
      "Invalid vendor ID"
    );
  }


  // --------------------------------------
  // PRODUCT OWNERSHIP
  // --------------------------------------

  const product =
    await Product.findOne({
      _id: productId,
      vendor: vendorId
    });


  if (!product) {
    throw new Error(
      "Product not found or you do not have access to this product"
    );
  }


  // --------------------------------------
  // UPDATE NAME
  // --------------------------------------

  if (
    data.name !== undefined
  ) {
    product.name =
      data.name;
  }


  // --------------------------------------
  // UPDATE DESCRIPTION
  // --------------------------------------

  if (
    data.description !== undefined
  ) {
    product.description =
      data.description;
  }


  // --------------------------------------
  // UPDATE PRICE
  // --------------------------------------

  if (
    data.price !== undefined
  ) {

    if (
      Number(data.price) < 0
    ) {
      throw new Error(
        "Price cannot be negative"
      );
    }

    product.price =
      Number(data.price);
  }


  // --------------------------------------
  // UPDATE STOCK
  // --------------------------------------

  if (
    data.stock !== undefined
  ) {

    if (
      Number(data.stock) < 0
    ) {
      throw new Error(
        "Stock cannot be negative"
      );
    }

    product.stock =
      Number(data.stock);
  }


  // --------------------------------------
  // UPDATE CATEGORY
  // --------------------------------------

  if (
    data.category !== undefined
  ) {
    product.category =
      data.category;
  }


  // --------------------------------------
  // UPDATE IMAGE
  // --------------------------------------

  if (
    data.image !== undefined
  ) {
    product.image =
      data.image;
  }


  // --------------------------------------
  // UPDATE PRODUCT ACTIVE STATUS
  // --------------------------------------

  if (
    data.isActive !== undefined
  ) {
    product.isActive =
      data.isActive;
  }


  // --------------------------------------
  // SAVE
  // --------------------------------------

  await product.save();


  return product;
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (
  productId,
  vendorId
) => {

  // --------------------------------------
  // VALIDATE PRODUCT ID
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }


  // --------------------------------------
  // DELETE ONLY OWN PRODUCT
  // --------------------------------------

  const product =
    await Product.findOneAndDelete({
      _id: productId,
      vendor: vendorId
    });


  if (!product) {
    throw new Error(
      "Product not found or you do not have access to this product"
    );
  }


  return product;
};


// ========================================
// ADMIN - GET ALL PRODUCTS
// ========================================

const getAllProductsAdmin =
  async () => {

    const products =
      await Product.find()
        .populate(
          "category",
          "name"
        )
        .populate(
          "vendor",
          "businessName ownerName email status isActive"
        )
        .sort({
          createdAt: -1
        });


    return products;
  };


// ========================================
// ADMIN - UPDATE PRODUCT
// ========================================

const updateProductAdmin = async (
  productId,
  data
) => {

  // --------------------------------------
  // VALIDATE PRODUCT ID
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }


  // --------------------------------------
  // FIND PRODUCT
  // --------------------------------------

  const product =
    await Product.findById(
      productId
    );


  if (!product) {
    throw new Error(
      "Product not found"
    );
  }


  // --------------------------------------
  // NAME
  // --------------------------------------

  if (
    data.name !== undefined
  ) {
    product.name =
      data.name;
  }


  // --------------------------------------
  // DESCRIPTION
  // --------------------------------------

  if (
    data.description !== undefined
  ) {
    product.description =
      data.description;
  }


  // --------------------------------------
  // PRICE
  // --------------------------------------

  if (
    data.price !== undefined
  ) {

    if (
      Number(data.price) < 0
    ) {
      throw new Error(
        "Price cannot be negative"
      );
    }

    product.price =
      Number(data.price);
  }


  // --------------------------------------
  // STOCK
  // --------------------------------------

  if (
    data.stock !== undefined
  ) {

    if (
      Number(data.stock) < 0
    ) {
      throw new Error(
        "Stock cannot be negative"
      );
    }

    product.stock =
      Number(data.stock);
  }


  // --------------------------------------
  // CATEGORY
  // --------------------------------------

  if (
    data.category !== undefined
  ) {
    product.category =
      data.category;
  }


  // --------------------------------------
  // IMAGE
  // --------------------------------------

  if (
    data.image !== undefined
  ) {
    product.image =
      data.image;
  }


  // --------------------------------------
  // ACTIVE STATUS
  // --------------------------------------

  if (
    data.isActive !== undefined
  ) {
    product.isActive =
      data.isActive;
  }


  await product.save();


  return product;
};


// ========================================
// ADMIN - DELETE PRODUCT
// ========================================

const deleteProductAdmin = async (
  productId
) => {

  // --------------------------------------
  // VALIDATE PRODUCT ID
  // --------------------------------------

  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }


  // --------------------------------------
  // DELETE PRODUCT
  // --------------------------------------

  const product =
    await Product.findByIdAndDelete(
      productId
    );


  if (!product) {
    throw new Error(
      "Product not found"
    );
  }


  return product;
};


// ========================================
// ADMIN - UPDATE PRODUCT STATUS
// ========================================

const updateProductStatusAdmin =
  async (
    productId,
    isActive
  ) => {

    // ------------------------------------
    // VALIDATE PRODUCT ID
    // ------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      )
    ) {
      throw new Error(
        "Invalid product ID"
      );
    }


    // ------------------------------------
    // VALIDATE STATUS
    // ------------------------------------

    if (
      typeof isActive !== "boolean"
    ) {
      throw new Error(
        "isActive must be true or false"
      );
    }


    // ------------------------------------
    // FIND PRODUCT
    // ------------------------------------

    const product =
      await Product.findById(
        productId
      );


    if (!product) {
      throw new Error(
        "Product not found"
      );
    }


    // ------------------------------------
    // UPDATE STATUS
    // ------------------------------------

    product.isActive =
      isActive;


    await product.save();


    return product;
  };


// ========================================
// EXPORT
// ========================================

module.exports = {

  getProducts,

  getProductById,

  getVendorProducts,

  createProduct,

  updateProduct,

  deleteProduct,

  // ADMIN

  getAllProductsAdmin,

  updateProductAdmin,

  deleteProductAdmin,

  updateProductStatusAdmin

};