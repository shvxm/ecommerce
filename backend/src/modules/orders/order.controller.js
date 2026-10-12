const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("./order.service");

const createOrderController = async (
  req,
  res,
  next
) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      paymentId,
      razorpayOrderId,
    } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Payment method is required",
      });
    }

    if (
      !["COD", "RAZORPAY"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method",
      });
    }

    /*
     * Razorpay payment ID is required
     * when creating a paid order.
     *
     * This endpoint should only be called
     * after Razorpay payment verification.
     */
    if (
      paymentMethod === "RAZORPAY" &&
      !paymentId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay payment information is required",
      });
    }

    const order = await createOrder(
      req.user.userId,
      shippingAddress,
      paymentMethod,
      paymentId || null,
      razorpayOrderId || null
    );

    res.status(201).json({
      success: true,
      message:
        "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


const getMyOrdersController = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await getMyOrders(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message:
        "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


const getOrderByIdController = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await getOrderById(
        req.params.id,
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message:
        "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


const cancelOrderController = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await cancelOrder(
        req.params.id,
        req.user.userId
      );

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  cancelOrderController,
};