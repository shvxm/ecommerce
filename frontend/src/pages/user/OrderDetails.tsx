import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag
} from "lucide-react";

import {
  getOrderById,
  cancelOrder
} from "../../services/orderApi";

import type {
  Order
} from "../../services/orderApi";

import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);

      setOrder(data);
    } catch (error: any) {
      console.error(
        "Failed to fetch order:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const updatedOrder = await cancelOrder(
        order._id
      );

      setOrder(updatedOrder);
    } catch (error: any) {
      console.error(
        "Failed to cancel order:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );
  };

  const getStatusClass = (
    status: Order["status"]
  ) => {
    return `detail-status ${status.toLowerCase()}`;
  };

  const statusSteps = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED"
  ] as const;

  const getStepClass = (
    step: typeof statusSteps[number]
  ) => {
    if (!order) {
      return "";
    }

    if (order.status === "CANCELLED") {
      return "";
    }

    const currentIndex =
      statusSteps.indexOf(order.status as any);

    const stepIndex =
      statusSteps.indexOf(step);

    if (stepIndex < currentIndex) {
      return "completed";
    }

    if (stepIndex === currentIndex) {
      return "current";
    }

    return "";
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-loading">
          Loading order details...
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">

          <div className="order-details-error-page">
            <Package size={48} />

            <h1>
              Order Not Found
            </h1>

            <p>
              We couldn't find this order.
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
            >
              Back to Orders
            </button>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">

      <div className="order-details-container">

        <Link
          to="/orders"
          className="back-orders-link"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        <div className="order-details-header">

          <div>
            <span className="order-details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>

            <p>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={getStatusClass(
              order.status
            )}
          >
            {order.status}
          </span>

        </div>

        {error && (
          <div className="order-details-error">
            {error}
          </div>
        )}

        {order.status === "CANCELLED" ? (
          <div className="cancelled-banner">
            <XCircle size={22} />

            <div>
              <strong>
                Order Cancelled
              </strong>

              <p>
                This order has been cancelled.
              </p>
            </div>
          </div>
        ) : (
          <section className="tracking-card">

            <div className="tracking-header">
              <div>
                <span>
                  ORDER STATUS
                </span>

                <h2>
                  Track your order
                </h2>
              </div>

              <Truck size={25} />
            </div>

            <div className="tracking-steps">

              {statusSteps.map(
                (step, index) => (

                  <div
                    className={`tracking-step ${getStepClass(
                      step
                    )}`}
                    key={step}
                  >

                    <div className="tracking-step-icon">
                      {getStepClass(step) ===
                      "completed" ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        <span>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <span>
                      {step}
                    </span>

                  </div>

                )
              )}

            </div>

          </section>
        )}

        <div className="order-details-grid">

          <section className="details-card">

            <div className="details-card-heading">
              <ShoppingBag size={19} />

              <h2>
                Items
              </h2>
            </div>

            <div className="details-items">

              {order.items.map(
                (item, index) => (

                  <div
                    className="details-item"
                    key={`${order._id}-${index}`}
                  >

                    <div className="details-item-image">
                      <img
                        src={
                          item.product?.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={
                          item.product?.name ||
                          "Product"
                        }
                      />
                    </div>

                    <div className="details-item-info">

                      <h3>
                        {item.product?.name ||
                          "Product unavailable"}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <span>
                        {formatPrice(item.price)}
                        {" "}each
                      </span>

                    </div>

                    <strong>
                      {formatPrice(item.subtotal)}
                    </strong>

                  </div>

                )
              )}

            </div>

            <div className="details-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(order.totalAmount)}
              </strong>

            </div>

          </section>

          <section className="details-card">

            <div className="details-card-heading">
              <MapPin size={19} />

              <h2>
                Shipping Address
              </h2>
            </div>

            <div className="shipping-details">

              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <p>
                {order.shippingAddress.address}
              </p>

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </p>

              <p>
                {order.shippingAddress.pincode}
              </p>

              <div className="shipping-phone">
                <Phone size={15} />

                <span>
                  {order.shippingAddress.phone}
                </span>
              </div>

            </div>

          </section>

          <section className="details-card">

            <div className="details-card-heading">
              <CalendarDays size={19} />

              <h2>
                Order Information
              </h2>
            </div>

            <div className="order-information">

              <div>
                <span>
                  Order ID
                </span>

                <strong>
                  {order._id}
                </strong>
              </div>

              <div>
                <span>
                  Order Date
                </span>

                <strong>
                  {formatDate(order.createdAt)}
                </strong>
              </div>

              <div>
                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(order.updatedAt)}
                </strong>
              </div>

            </div>

          </section>

        </div>

        {(order.status === "PENDING" ||
          order.status === "CONFIRMED") && (

          <div className="order-actions">

            <button
              type="button"
              className="cancel-details-btn"
              disabled={cancelling}
              onClick={handleCancelOrder}
            >
              <XCircle size={17} />

              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>

          </div>

        )}

      </div>

    </main>
  );
};

export default OrderDetails;