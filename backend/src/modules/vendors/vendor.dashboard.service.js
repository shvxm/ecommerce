const Product = require("../products/product.model");
const Order = require("../orders/order.model");

const getVendorDashboard = async (vendorId) => {
  const products = await Product.find({
    vendor: vendorId
  });

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const orders = await Order.find({
    "items.vendor": vendorId
  });

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
  (order) => order.status === "CANCELLED"
).length;

  return {
    totalProducts,
    totalStock,
    totalOrders,
    orderStatus: {
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
  getVendorDashboard
};