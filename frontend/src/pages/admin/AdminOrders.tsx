import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  X
} from "lucide-react";

import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus
} from "../../services/adminApi";

import type { AdminOrder } from "../../services/adminApi";

import "./AdminOrders.css";

type OrderStatus = AdminOrder["status"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | OrderStatus>("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminOrders();

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const searchText = search.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchText) ||
        order.user?.name
          ?.toLowerCase()
          .includes(searchText) ||
        order.user?.email
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const statusCounts = {
    total: orders.length,

    pending: orders.filter(
      (order) => order.status === "PENDING"
    ).length,

    processing: orders.filter(
      (order) => order.status === "PROCESSING"
    ).length,

    shipped: orders.filter(
      (order) => order.status === "SHIPPED"
    ).length,

    delivered: orders.filter(
      (order) => order.status === "DELIVERED"
    ).length,

    cancelled: orders.filter(
      (order) => order.status === "CANCELLED"
    ).length
  };

  const handleViewOrder = async (
    orderId: string
  ) => {
    try {
      setDetailsLoading(true);
      setError("");

      const order =
        await getAdminOrderById(orderId);

      setSelectedOrder(order);
    } catch (error) {
      console.error(error);
      setError("Unable to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const updatedOrder =
        await updateAdminOrderStatus(
          orderId,
          status
        );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? updatedOrder
            : order
        )
      );

      if (
        selectedOrder &&
        selectedOrder._id === orderId
      ) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">

        <div>
          <h1>Orders</h1>
          <p>
            Manage and track customer orders
          </p>
        </div>

        <button
          className="orders-refresh-button"
          onClick={loadOrders}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      <div className="orders-stats">

        <div className="orders-stat-card">
          <Package size={22} />
          <div>
            <span>Total Orders</span>
            <strong>{statusCounts.total}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div>
            <span>Pending</span>
            <strong>{statusCounts.pending}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div>
            <span>Processing</span>
            <strong>{statusCounts.processing}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div>
            <span>Shipped</span>
            <strong>{statusCounts.shipped}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div>
            <span>Delivered</span>
            <strong>{statusCounts.delivered}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div>
            <span>Cancelled</span>
            <strong>{statusCounts.cancelled}</strong>
          </div>
        </div>

      </div>

      <div className="orders-toolbar">

        <div className="orders-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search order ID, customer name or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="orders-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | OrderStatus
            )
          }
        >
          <option value="ALL">
            All Statuses
          </option>

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

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

      </div>

      {error && (
        <div className="orders-error">
          {error}
        </div>
      )}

      <div className="orders-table-card">

        {loading ? (
          <div className="orders-loading">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <Package size={42} />

            <h3>No orders found</h3>

            <p>
              Try changing your search or status
              filter.
            </p>
          </div>
        ) : (
          <div className="orders-table-wrapper">

            <table className="orders-table">

              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      <strong>
                        #{order._id.slice(-8)}
                      </strong>
                    </td>

                    <td>
                      <div className="order-customer">

                        <strong>
                          {order.user?.name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {order.user?.email ||
                            "-"}
                        </span>

                      </div>
                    </td>

                    <td>
                      {order.items?.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      )}
                    </td>

                    <td>
                      <strong>
                        {formatAmount(
                          order.totalAmount
                        )}
                      </strong>
                    </td>

                    <td>
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    <td>

                      <select
                        className={`order-status-select ${order.status.toLowerCase()}`}
                        value={order.status}
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target
                              .value as OrderStatus
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

                        <option value="CANCELLED">
                          Cancelled
                        </option>

                      </select>

                    </td>

                    <td>

                      <button
                        className="order-view-button"
                        onClick={() =>
                          handleViewOrder(
                            order._id
                          )
                        }
                      >
                        <Eye size={16} />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="order-modal-header">

              <div>
                <h2>
                  Order #
                  {selectedOrder._id.slice(-8)}
                </h2>

                <p>
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                className="order-modal-close"
                onClick={closeDetails}
              >
                <X size={20} />
              </button>

            </div>

            {detailsLoading ? (
              <div className="orders-loading">
                Loading details...
              </div>
            ) : (
              <>

                <div className="order-detail-section">

                  <h3>Customer</h3>

                  <p>
                    <strong>
                      {selectedOrder.user?.name}
                    </strong>
                  </p>

                  <p>
                    {selectedOrder.user?.email}
                  </p>

                </div>

                <div className="order-detail-section">

                  <h3>Shipping Address</h3>

                  <p>
                    {
                      selectedOrder
                        .shippingAddress
                        .fullName
                    }
                  </p>

                  <p>
                    {
                      selectedOrder
                        .shippingAddress
                        .phone
                    }
                  </p>

                  <p>
                    {
                      selectedOrder
                        .shippingAddress
                        .address
                    }
                    ,{" "}
                    {
                      selectedOrder
                        .shippingAddress
                        .city
                    }
                    ,{" "}
                    {
                      selectedOrder
                        .shippingAddress
                        .state
                    }{" "}
                    -{" "}
                    {
                      selectedOrder
                        .shippingAddress
                        .pincode
                    }
                  </p>

                </div>

                <div className="order-detail-section">

                  <h3>Items</h3>

                  <div className="order-items">

                    {selectedOrder.items.map(
                      (item, index) => (

                        <div
                          className="order-item"
                          key={`${item.product?._id}-${index}`}
                        >

                          <div>
                            <strong>
                              {item.product?.name ||
                                "Product"}
                            </strong>

                            <span>
                              Qty:{" "}
                              {item.quantity}
                            </span>
                          </div>

                          <strong>
                            {formatAmount(
                              item.subtotal
                            )}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                </div>

                <div className="order-detail-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    {formatAmount(
                      selectedOrder.totalAmount
                    )}
                  </strong>

                </div>

              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminOrders;