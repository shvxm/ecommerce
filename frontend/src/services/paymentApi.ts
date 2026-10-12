import api from "./api";


// =====================================================
// RAZORPAY ORDER RESPONSE
// =====================================================

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  key: string;
}


// =====================================================
// RAZORPAY PAYMENT RESPONSE
// =====================================================

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


// =====================================================
// VERIFY PAYMENT PAYLOAD
// =====================================================

export interface VerifyRazorpayPaymentPayload {

  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  razorpayOrderId: string;

  razorpayPaymentId: string;

  razorpaySignature: string;
}


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

export const createRazorpayOrder =
  async () => {

    const response =
      await api.post(
        "/payments/create-order"
      );

    return response.data;
  };


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

export const verifyRazorpayPayment =
  async (
    payload: VerifyRazorpayPaymentPayload
  ) => {

    const response =
      await api.post(
        "/payments/verify",
        payload
      );

    return response.data;
  };