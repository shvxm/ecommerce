const User = require("../users/user.model");
const Vendor = require("../vendors/vendor.model");
const Product = require("../products/product.model");
const Order = require("../orders/order.model");

const getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments({
    role: "USER"
  });

  const totalVendors = await Vendor.countDocuments();

  const approvedVendors = await Vendor.countDocuments({
    status: "APPROVED"
  });

  const pendingVendors = await Vendor.countDocuments({
    status: "PENDING"
  });

  const totalProducts = await Product.countDocuments();

  const activeProducts = await Product.countDocuments({
    isActive: true
  });

  const totalOrders = await Order.countDocuments();

  const pendingOrders = await Order.countDocuments({
    status: "PENDING"
  });

  const confirmedOrders = await Order.countDocuments({
    status: "CONFIRMED"
  });

  const processingOrders = await Order.countDocuments({
    status: "PROCESSING"
  });

  const shippedOrders = await Order.countDocuments({
    status: "SHIPPED"
  });

  const deliveredOrders = await Order.countDocuments({
    status: "DELIVERED"
  });

  const cancelledOrders = await Order.countDocuments({
    status: "CANCELLED"
  });

  const products = await Product.find().select("stock");

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return {
    users: {
      total: totalUsers
    },

    vendors: {
      total: totalVendors,
      approved: approvedVendors,
      pending: pendingVendors
    },

    products: {
      total: totalProducts,
      active: activeProducts
    },

    inventory: {
      totalStock
    },

    orders: {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    }
  };
};

module.exports = {
  getAdminDashboard
};