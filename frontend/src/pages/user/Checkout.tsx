import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Plus,
  Pencil,
  CreditCard,
  Banknote,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getCart,
} from "../../services/cartApi";

import type {
  Cart,
} from "../../services/cartApi";

import {
  createOrder,
} from "../../services/orderApi";

import type {
  ShippingAddress,
  PaymentMethod,
} from "../../services/orderApi";

import {
  getAddresses,
} from "../../services/userService";

import type {
  Address,
} from "../../services/userService";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/paymentApi";

import "./Checkout.css";


// =====================================================
// CHECKOUT COMPONENT
// =====================================================

const Checkout = () => {
  const navigate = useNavigate();


  // ===================================================
  // STATE
  // ===================================================

  const [cart, setCart] =
    useState<Cart | null>(null);

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");


  // ===================================================
  // LOAD RAZORPAY SCRIPT
  // ===================================================

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {

      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );


      // Script already loaded
      if (existingScript) {
        resolve(true);
        return;
      }


      // Create Razorpay script
      const script =
        document.createElement("script");


      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";


      script.onload = () => {
        resolve(true);
      };


      script.onerror = () => {
        resolve(false);
      };


      document.body.appendChild(script);
    });
  };


  // ===================================================
  // LOAD CHECKOUT DATA
  // ===================================================

  useEffect(() => {

    const loadCheckoutData =
      async () => {

        const token =
          localStorage.getItem("token");


        // User is not logged in
        if (!token) {
          navigate("/login");
          return;
        }


        try {

          setLoading(true);

          setError("");


          // Load cart and addresses together
          const [
            cartData,
            addressData,
          ] = await Promise.all([
            getCart(),
            getAddresses(),
          ]);


          // Cart empty
          if (
            !cartData ||
            cartData.items.length === 0
          ) {
            navigate("/cart");
            return;
          }


          setCart(cartData);


          // Make sure addresses is an array
          const safeAddresses =
            Array.isArray(addressData)
              ? addressData
              : [];


          setAddresses(
            safeAddresses
          );


          // Find default address
          const defaultAddress =
            safeAddresses.find(
              (address) =>
                address.isDefault
            );


          // Select default address
          if (defaultAddress) {

            setSelectedAddressId(
              defaultAddress._id
            );

          } else if (
            safeAddresses.length > 0
          ) {

            // Otherwise select first address
            setSelectedAddressId(
              safeAddresses[0]._id
            );
          }

        } catch (error: any) {

          console.error(
            "Checkout loading error:",
            error
          );


          setError(
            error?.response?.data?.message ||
              "Failed to load checkout."
          );

        } finally {

          setLoading(false);
        }
      };


    loadCheckoutData();

  }, [navigate]);


  // ===================================================
  // CONVERT ADDRESS
  // ===================================================

  const convertToShippingAddress =
    (
      address: Address
    ): ShippingAddress => {

      const completeAddress =
        address.addressLine2.trim()
          ? `${address.addressLine1}, ${address.addressLine2}`
          : address.addressLine1;


      return {

        fullName:
          address.fullName,

        phone:
          address.phone,

        address:
          completeAddress,

        city:
          address.city,

        state:
          address.state,

        pincode:
          address.pincode,
      };
    };


  // ===================================================
  // HANDLE CHECKOUT SUBMIT
  // ===================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    setError("");


    // -------------------------------------------------
    // ADDRESS VALIDATION
    // -------------------------------------------------

    if (!selectedAddressId) {

      setError(
        "Please select a delivery address."
      );

      return;
    }


    const selectedAddress =
      addresses.find(
        (address) =>
          address._id ===
          selectedAddressId
      );


    if (!selectedAddress) {

      setError(
        "Selected address was not found."
      );

      return;
    }


    try {

      setPlacingOrder(true);


      // Convert address into order format
      const shippingAddress =
        convertToShippingAddress(
          selectedAddress
        );


      // =================================================
      // COD PAYMENT
      // =================================================

      if (
        paymentMethod === "COD"
      ) {

        const order =
          await createOrder(
            shippingAddress,
            "COD"
          );


        navigate(
          `/order-success/${order._id}`
        );


        return;
      }


      // =================================================
      // RAZORPAY PAYMENT
      // =================================================

      const razorpayLoaded =
        await loadRazorpayScript();


      if (!razorpayLoaded) {

        setError(
          "Razorpay failed to load. Please check your internet connection."
        );

        setPlacingOrder(false);

        return;
      }


      // =================================================
      // CREATE RAZORPAY ORDER
      // =================================================

      const razorpayResponse =
        await createRazorpayOrder();


      const razorpayOrder =
        razorpayResponse.data;


      if (!razorpayOrder) {

        throw new Error(
          "Unable to create Razorpay order."
        );
      }


      // =================================================
      // RAZORPAY CHECKOUT OPTIONS
      // =================================================

      const options = {

        // Public Razorpay Key
        key:
          razorpayOrder.key,


        // Amount in paise
        amount:
          razorpayOrder.amount,


        // INR
        currency:
          razorpayOrder.currency,


        // Store name
        name:
          "E-Commerce Store",


        // Payment description
        description:
          "E-Commerce Order Payment",


        // Razorpay Order ID
        order_id:
          razorpayOrder.id,


        // Customer details
        prefill: {

          name:
            selectedAddress.fullName,

          contact:
            selectedAddress.phone,
        },


        // Checkout theme
        theme: {

          color:
            "#111827",
        },


        // =================================================
        // PAYMENT SUCCESS CALLBACK
        // =================================================

        handler: async function (
          response: {
            razorpay_payment_id: string;

            razorpay_order_id: string;

            razorpay_signature: string;
          }
        ) {

          try {

            console.log(
              "Razorpay payment response:",
              response
            );


            // =============================================
            // VERIFY PAYMENT ON BACKEND
            // =============================================

            const verifyResponse =
              await verifyRazorpayPayment({

                shippingAddress,

                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpaySignature:
                  response.razorpay_signature,
              });


            const order =
              verifyResponse.data;


            // =============================================
            // ORDER SUCCESS
            // =============================================

            navigate(
              `/order-success/${order._id}`
            );

          } catch (error: any) {

            console.error(
              "Payment verification error:",
              error
            );


            setError(
              error?.response?.data?.message ||
                "Payment verification failed."
            );


            setPlacingOrder(false);
          }
        },


        // =================================================
        // PAYMENT POPUP CLOSED
        // =================================================

        modal: {

          ondismiss: () => {

            console.log(
              "Razorpay checkout closed."
            );


            setPlacingOrder(false);
          },
        },
      };


      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      const Razorpay =
        (window as any).Razorpay;


      if (!Razorpay) {

        throw new Error(
          "Razorpay checkout is not available."
        );
      }


      const razorpay =
        new Razorpay(options);


      // =================================================
      // OPEN RAZORPAY POPUP
      // =================================================

      razorpay.open();

    } catch (error: any) {

      console.error(
        "Order/payment error:",
        error
      );


      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to process your order."
      );


      setPlacingOrder(false);
    }
  };


  // ===================================================
  // FORMAT PRICE
  // ===================================================

  const formatPrice =
    (price: number) => {

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(price);
    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <main className="checkout-page">

        <div className="checkout-loading">

          Loading checkout...

        </div>

      </main>
    );
  }


  // ===================================================
  // NO CART
  // ===================================================

  if (!cart) {
    return null;
  }


  // ===================================================
  // UI
  // ===================================================

  return (

    <main className="checkout-page">

      <div className="checkout-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkout-top">

          <Link
            to="/cart"
            className="back-to-cart"
          >

            <ArrowLeft size={18} />

            Back to Cart

          </Link>


          <h1>
            Checkout
          </h1>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="checkout-error">

            {error}

          </div>
        )}


        {/* =================================================
            CHECKOUT LAYOUT
        ================================================= */}

        <div className="checkout-layout">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <form
            className="shipping-card"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="section-title">

              <div className="section-icon">

                <MapPin size={20} />

              </div>


              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Select your delivery address.
                </p>

              </div>

            </div>


            {/* =================================================
                NO ADDRESS
            ================================================= */}

            {addresses.length === 0 && (

              <div className="no-address-box">

                <MapPin size={32} />


                <h3>
                  No saved address
                </h3>


                <p>
                  Add a delivery address
                  before placing your order.
                </p>


                <button
                  type="button"
                  className="add-address-btn"
                  onClick={() =>
                    navigate("/addresses")
                  }
                >

                  <Plus size={17} />

                  Add New Address

                </button>

              </div>
            )}


            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            {addresses.length > 0 && (

              <div className="saved-addresses">

                {addresses.map(
                  (address) => (

                    <div
                      key={address._id}
                      className={`address-option ${
                        selectedAddressId ===
                        address._id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedAddressId(
                          address._id
                        )
                      }
                    >


                      <div className="address-radio">

                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={
                            selectedAddressId ===
                            address._id
                          }
                          onChange={() =>
                            setSelectedAddressId(
                              address._id
                            )
                          }
                        />

                      </div>


                      <div className="address-content">


                        <div className="address-header">

                          <div>

                            <strong>
                              {address.fullName}
                            </strong>


                            <span className="address-type">

                              {address.type}

                            </span>


                            {address.isDefault && (

                              <span className="default-badge">

                                Default

                              </span>
                            )}

                          </div>

                        </div>


                        <p>
                          {address.addressLine1}

                          {address.addressLine2
                            ? `, ${address.addressLine2}`
                            : ""}
                        </p>


                        <p>

                          {address.city},{" "}

                          {address.state} -{" "}

                          {address.pincode}

                        </p>


                        <p>

                          Phone:{" "}

                          {address.phone}

                        </p>

                      </div>


                      <button
                        type="button"
                        className="edit-address-btn"
                        onClick={(event) => {

                          event.stopPropagation();

                          navigate(
                            `/addresses?edit=${address._id}`
                          );
                        }}
                      >

                        <Pencil size={15} />

                        Edit

                      </button>

                    </div>
                  )
                )}

              </div>
            )}


            {/* =================================================
                PAYMENT SECTION
            ================================================= */}

            <div className="payment-section">


              <div className="section-title">

                <div className="section-icon">

                  <CreditCard size={20} />

                </div>


                <div>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose your payment method.
                  </p>

                </div>

              </div>


              {/* =================================================
                  PAYMENT OPTIONS
              ================================================= */}

              <div className="payment-options">


                {/* =================================================
                    COD
                ================================================= */}

                <label
                  className={`payment-option ${
                    paymentMethod === "COD"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={() => {

                      setPaymentMethod(
                        "COD"
                      );

                      setError("");
                    }}
                  />


                  <div className="payment-icon">

                    <Banknote size={22} />

                  </div>


                  <div className="payment-text">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>

                  </div>

                </label>


                {/* =================================================
                    RAZORPAY
                ================================================= */}

                <label
                  className={`payment-option ${
                    paymentMethod === "RAZORPAY"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={
                      paymentMethod ===
                      "RAZORPAY"
                    }
                    onChange={() => {

                      setPaymentMethod(
                        "RAZORPAY"
                      );

                      setError("");
                    }}
                  />


                  <div className="payment-icon">

                    <CreditCard size={22} />

                  </div>


                  <div className="payment-text">

                    <strong>
                      Razorpay
                    </strong>

                    <span>
                      Pay securely using UPI,
                      Card or NetBanking
                    </span>

                  </div>

                </label>

              </div>


              {/* =================================================
                  RAZORPAY SECURITY MESSAGE
              ================================================= */}

              {paymentMethod ===
                "RAZORPAY" && (

                <div className="card-security">

                  <ShieldCheck size={17} />

                  <span>

                    You will be redirected to
                    Razorpay's secure checkout
                    to complete your payment.

                  </span>

                </div>
              )}

            </div>


            {/* =================================================
                SECURITY MESSAGE
            ================================================= */}

            <div className="secure-message">

              <ShieldCheck size={19} />

              <span>

                Your delivery and payment
                information is securely processed.

              </span>

            </div>


            {/* =================================================
                PLACE ORDER BUTTON
            ================================================= */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={
                placingOrder ||
                addresses.length === 0
              }
            >

              {placingOrder

                ? "Processing..."

                : paymentMethod === "COD"

                ? "Place COD Order"

                : "Pay & Place Order"}

            </button>

          </form>


          {/* =================================================
              RIGHT SIDE - ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">


            <h2>
              Order Summary
            </h2>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="checkout-products">

              {cart.items.map(
                (item) => (

                  <div
                    className="checkout-product"
                    key={item.product._id}
                  >


                    <div className="checkout-product-image">

                      <img
                        src={
                          item.product.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={
                          item.product.name
                        }
                      />


                      <span>
                        {item.quantity}
                      </span>

                    </div>


                    <div className="checkout-product-info">

                      <p>
                        {item.product.name}
                      </p>


                      <strong>

                        {formatPrice(
                          item.product.price *
                          item.quantity
                        )}

                      </strong>

                    </div>

                  </div>
                )
              )}

            </div>


            <div className="checkout-divider" />


            {/* =================================================
                ITEMS
            ================================================= */}

            <div className="checkout-summary-row">

              <span>
                Items
              </span>

              <strong>
                {cart.totalItems}
              </strong>

            </div>


            {/* =================================================
                DELIVERY
            ================================================= */}

            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>


            <div className="checkout-divider" />


            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(
                  cart.totalAmount
                )}
              </strong>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
};


export default Checkout;