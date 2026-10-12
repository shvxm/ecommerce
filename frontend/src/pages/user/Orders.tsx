import { useEffect, useState } from "react";
import {
  Package,
  ChevronRight,
  XCircle,
  ShoppingBag
} from "lucide-react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  getMyOrders,
  cancelOrder
} from "../../services/orderApi";

import type {
  Order
} from "../../services/orderApi";

import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancellingOrder, setCancellingOrder] =
    useState<string | null>(null);

  const fetchOrders = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getMyOrders();

      setOrders(data);
    } catch (error: any) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (
    orderId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      setError("");

      const updatedOrder =
        await cancelOrder(orderId);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );
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
      setCancellingOrder(null);
    }
  };

  const formatPrice = (
    price: number
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(price);
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const getStatusClass = (
    status: Order["status"]
  ) => {
    return `order-status ${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-loading">
          Loading your orders...
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">

      <div className="orders-container">

        <div className="orders-header">

          <div>
            <h1>
              My Orders
            </h1>

            <p>
              Track and manage your
              purchases
            </p>
          </div>

          <Link
            to="/products"
            className="shop-more-btn"
          >
            <ShoppingBag size={17} />
            Continue Shopping
          </Link>

        </div>

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders">

            <div className="no-orders-icon">
              <Package size={48} />
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any
              orders yet.
            </p>

            <Link
              to="/products"
              className="start-shopping-btn"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (

              <article
                className="order-card"
                key={order._id}
              >

                <div className="order-card-header">

                  <div className="order-meta">

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
                        Ordered on
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>
                    </div>

                  </div>

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="order-products">

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="order-product"
                        key={`${order._id}-${index}`}
                      >

                        <div className="order-product-image">

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

                        <div className="order-product-info">

                          <h3>
                            {item.product?.name ||
                              "Product unavailable"}
                          </h3>

                          <p>
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <strong>
                            {formatPrice(
                              item.subtotal
                            )}
                          </strong>

                        </div>

                      </div>

                    )
                  )}

                </div>

                <div className="order-card-footer">

                  <div className="order-total">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      {formatPrice(
                        order.totalAmount
                      )}
                    </strong>

                  </div>

                  <div className="order-buttons">

                    {(order.status ===
                      "PENDING" ||
                      order.status ===
                        "CONFIRMED") && (

                      <button
                        type="button"
                        className="cancel-order-btn"
                        disabled={
                          cancellingOrder ===
                          order._id
                        }
                        onClick={() =>
                          handleCancelOrder(
                            order._id
                          )
                        }
                      >
                        <XCircle size={16} />

                        {cancellingOrder ===
                        order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>

                    )}

                    <button
                      type="button"
                      className="view-order-btn"
                      onClick={() =>
                        navigate(
                          `/orders/${order._id}`
                        )
                      }
                    >
                      View Details
                      <ChevronRight
                        size={17}
                      />
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

      </div>

    </main>
  );
};

export default Orders;