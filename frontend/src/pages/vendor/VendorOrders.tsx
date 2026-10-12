import { useEffect, useState } from "react";
import {
  Package,
  ChevronDown,
  RefreshCw
} from "lucide-react";

import {
  getVendorOrders,
  updateVendorOrderStatus,
  type VendorOrder
} from "../../services/vendorApi";

import "./VendorOrders.css";


const VendorOrders = () => {

  const [orders, setOrders] = useState<VendorOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingOrder, setUpdatingOrder] = useState("");


  // ========================================
  // LOAD ORDERS
  // ========================================

  const loadOrders = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getVendorOrders();

      setOrders(data);

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Failed to load vendor orders"
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {

    loadOrders();

  }, []);


  // ========================================
  // UPDATE STATUS
  // ========================================

  const handleStatusChange = async (
    orderId: string,
    status:
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
  ) => {

    try {

      setUpdatingOrder(orderId);

      setError("");

      const updatedOrder =
        await updateVendorOrderStatus(
          orderId,
          status
        );


      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Failed to update order status"
      );

    } finally {

      setUpdatingOrder("");

    }

  };


  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (status: string) => {

    switch (status) {

      case "PENDING":
        return "vendor-status pending";

      case "CONFIRMED":
        return "vendor-status confirmed";

      case "PROCESSING":
        return "vendor-status processing";

      case "SHIPPED":
        return "vendor-status shipped";

      case "DELIVERED":
        return "vendor-status delivered";

      case "CANCELLED":
        return "vendor-status cancelled";

      default:
        return "vendor-status";

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="vendor-orders-page">

        <div className="vendor-orders-loading">

          <RefreshCw
            size={20}
            className="loading-icon"
          />

          Loading orders...

        </div>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="vendor-orders-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="vendor-orders-header">

        <div>

          <p className="vendor-orders-eyebrow">
            VENDOR PORTAL
          </p>

          <h1>Orders</h1>

          <p>
            Manage orders containing your products.
          </p>

        </div>


        <button
          className="refresh-orders-button"
          onClick={loadOrders}
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </div>



      {/* ==================================
          ERROR
      ================================== */}

      {error && (

        <div className="vendor-orders-error">

          {error}

        </div>

      )}



      {/* ==================================
          STATS
      ================================== */}

      <div className="vendor-orders-stats">

        <div className="vendor-order-stat">

          <span>Total Orders</span>

          <strong>
            {orders.length}
          </strong>

        </div>


        <div className="vendor-order-stat">

          <span>Pending</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "PENDING"
              ).length
            }
          </strong>

        </div>


        <div className="vendor-order-stat">

          <span>Processing</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "PROCESSING"
              ).length
            }
          </strong>

        </div>


        <div className="vendor-order-stat">

          <span>Delivered</span>

          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === "DELIVERED"
              ).length
            }
          </strong>

        </div>

      </div>



      {/* ==================================
          EMPTY STATE
      ================================== */}

      {orders.length === 0 ? (

        <div className="vendor-orders-empty">

          <div className="empty-icon">

            <Package size={30} />

          </div>

          <h2>No orders yet</h2>

          <p>
            Orders containing your products
            will appear here.
          </p>

        </div>

      ) : (


        /* ==================================
           ORDER LIST
        ================================== */

        <div className="vendor-orders-list">


          {orders.map((order) => (

            <div
              className="vendor-order-card"
              key={order._id}
            >


              {/* ============================
                  ORDER HEADER
              ============================ */}

              <div className="vendor-order-top">

                <div>

                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order._id.slice(-8).toUpperCase()}
                  </h2>

                  <p>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
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



              {/* ============================
                  CUSTOMER
              ============================ */}

              <div className="vendor-order-customer">

                <div>

                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {order.user?.name || "Customer"}
                  </strong>

                  <p>
                    {order.user?.email || "-"}
                  </p>

                </div>


                <div>

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>



              {/* ============================
                  SHIPPING ADDRESS
              ============================ */}

              <div className="vendor-shipping">

                <span>
                  SHIPPING ADDRESS
                </span>

                <p>
                  {order.shippingAddress.fullName}
                  {" · "}
                  {order.shippingAddress.phone}
                </p>

                <p>
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  -{" "}
                  {order.shippingAddress.pincode}
                </p>

              </div>



              {/* ============================
                  PRODUCTS
              ============================ */}

              <div className="vendor-order-products">

                <span className="products-heading">
                  PRODUCTS
                </span>


                {order.items.map((item, index) => (

                  <div
                    className="vendor-order-product"
                    key={`${order._id}-${item.product?._id || index}`}
                  >

                    <div className="vendor-product-image">

                      {item.product?.image ? (

                        <img
                          src={item.product.image}
                          alt={item.product.name}
                        />

                      ) : (

                        <Package size={20} />

                      )}

                    </div>


                    <div className="vendor-product-info">

                      <strong>
                        {item.product?.name ||
                          "Product"}
                      </strong>

                      <span>
                        Qty: {item.quantity}
                      </span>

                    </div>


                    <strong className="vendor-product-price">

                      ₹{item.subtotal.toLocaleString("en-IN")}

                    </strong>

                  </div>

                ))}

              </div>



              {/* ============================
                  STATUS UPDATE
              ============================ */}

              {order.status !== "CANCELLED" &&
                order.status !== "DELIVERED" && (

                  <div className="vendor-order-footer">

                    <div>

                      <span>
                        UPDATE ORDER STATUS
                      </span>

                    </div>


                    <div className="status-select-wrapper">

                      <select
                        value={order.status}
                        disabled={
                          updatingOrder === order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value as
                              | "CONFIRMED"
                              | "PROCESSING"
                              | "SHIPPED"
                              | "DELIVERED"
                          )
                        }
                      >

                        <option value="PENDING">
                          Pending
                        </option>

                        <option value="CONFIRMED">
                          Confirmed
                        </option>

                        <option value="PROCESSING">
                          Processing
                        </option>

                        <option value="SHIPPED">
                          Shipped
                        </option>

                        <option value="DELIVERED">
                          Delivered
                        </option>

                      </select>

                      <ChevronDown size={16} />

                    </div>

                  </div>

                )}


              {updatingOrder === order._id && (

                <div className="order-updating">

                  Updating order status...

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};


export default VendorOrders;