const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("./payment.service");


const createRazorpayOrderController =
  async (
    req,
    res,
    next
  ) => {
    try {

      const paymentOrder =
        await createRazorpayOrder(
          req.user.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Razorpay order created",
        data: paymentOrder,
      });

    } catch (error) {
      next(error);
    }
  };


const verifyRazorpayPaymentController =
  async (
    req,
    res,
    next
  ) => {
    try {

      const {
        shippingAddress,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = req.body;


      if (!shippingAddress) {
        return res.status(400).json({
          success: false,
          message:
            "Shipping address is required",
        });
      }


      if (
        !razorpayOrderId ||
        !razorpayPaymentId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Razorpay payment details are required",
        });
      }


      const order =
        await verifyRazorpayPayment({
          userId:
            req.user.userId,

          shippingAddress,

          razorpayOrderId,

          razorpayPaymentId,

          razorpaySignature,
        });


      res.status(200).json({
        success: true,
        message:
          "Payment verified and order created successfully",
        data: order,
      });

    } catch (error) {
      next(error);
    }
  };


module.exports = {
  createRazorpayOrderController,
  verifyRazorpayPaymentController,
};