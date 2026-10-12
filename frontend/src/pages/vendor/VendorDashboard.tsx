import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserRound,
  LogOut,
  Search,
  Bell,
  ArrowUpRight,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Boxes,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleDollarSign,
  Menu,
  X
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getVendorDashboard,
  getVendorOrders,
  type VendorDashboard as VendorDashboardData,
  type VendorOrder
} from "../../services/vendorApi";

import {
  getVendorProducts,
  type VendorProduct
} from "../../services/vendorProductApi";

import "./VendorDashboard.css";


const VendorDashboard = () => {

  const navigate = useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [dashboard, setDashboard] =
    useState<VendorDashboardData | null>(null);

  const [orders, setOrders] =
    useState<VendorOrder[]>([]);

  const [products, setProducts] =
    useState<VendorProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [chartRange, setChartRange] =
    useState<"7D" | "30D">("7D");


  // ========================================
  // VENDOR DATA
  // ========================================

  const vendorStorage =
    localStorage.getItem("vendor");

  let vendor: {
    id?: string;
    businessName?: string;
    ownerName?: string;
    email?: string;
  } | null = null;


  try {

    vendor = vendorStorage
      ? JSON.parse(vendorStorage)
      : null;

  } catch {

    vendor = null;

  }


  const vendorName =
    vendor?.businessName ||
    vendor?.ownerName ||
    "Vendor";


  // ========================================
  // LOAD DASHBOARD
  // ========================================

  const loadDashboard = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {

        setRefreshing(true);

      } else {

        setLoading(true);

      }

      setError("");


      const [
        dashboardData,
        ordersData,
        productsData
      ] = await Promise.all([

        getVendorDashboard(),

        getVendorOrders(),

        getVendorProducts()

      ]);


      setDashboard(dashboardData);

      setOrders(ordersData);

      setProducts(productsData);

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Failed to load vendor dashboard"
      );

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem("vendorToken");

    localStorage.removeItem("vendor");

    navigate("/vendor/login");

  };


  // ========================================
  // VENDOR SALES
  // ========================================

  const vendorSales = useMemo(() => {

    if (!vendor?.id) {

      return 0;

    }


    return orders.reduce((total, order) => {

      const vendorItems =
        order.items.filter(
          (item) =>
            item.vendor?._id === vendor?.id
        );


      const amount =
        vendorItems.reduce(
          (sum, item) =>
            sum + item.subtotal,
          0
        );


      return total + amount;

    }, 0);

  }, [orders, vendor?.id]);

  
  // ========================================
  // LOW STOCK PRODUCTS
  // ========================================

  const lowStockProducts = useMemo(() => {

    return products
      .filter(
        (product) =>
          product.stock <= 10
      )
      .sort(
        (a, b) =>
          a.stock - b.stock
      )
      .slice(0, 5);

  }, [products]);


  // ========================================
  // SEARCHED ORDERS
  // ========================================

  const filteredOrders = useMemo(() => {

    if (!search.trim()) {

      return orders;

    }


    const searchText =
      search.toLowerCase();


    return orders.filter((order) => {

      const orderId =
        order._id.toLowerCase();

      const customer =
        order.user?.name
          ?.toLowerCase() || "";

      const email =
        order.user?.email
          ?.toLowerCase() || "";


      return (
        orderId.includes(searchText) ||
        customer.includes(searchText) ||
        email.includes(searchText)
      );

    });

  }, [orders, search]);


  // ========================================
  // RECENT ORDERS
  // ========================================

  const recentOrders =
    filteredOrders.slice(0, 5);


  // ========================================
  // CHART DATA
  // ========================================

  const chartData = useMemo(() => {

    const days =
      chartRange === "7D"
        ? 7
        : 30;


    const result: {
      label: string;
      date: string;
      amount: number;
    }[] = [];


    const now = new Date();


    for (
      let i = days - 1;
      i >= 0;
      i--
    ) {

      const date = new Date(now);

      date.setHours(0, 0, 0, 0);

      date.setDate(
        date.getDate() - i
      );


      const dateKey =
        date.toISOString()
          .split("T")[0];


      const amount =
        orders.reduce(
          (total, order) => {

            if (
              order.status === "CANCELLED"
            ) {

              return total;

            }


            const orderDate =
              new Date(order.createdAt)
                .toISOString()
                .split("T")[0];


            if (orderDate !== dateKey) {

              return total;

            }


            const vendorAmount =
              order.items
                .filter(
                  (item) =>
                    item.vendor?._id === vendor?.id
                )
                .reduce(
                  (sum, item) =>
                    sum + item.subtotal,
                  0
                );


            return total + vendorAmount;

          },
          0
        );


      result.push({

        label:
          chartRange === "7D"
            ? date.toLocaleDateString(
                "en-IN",
                { weekday: "short" }
              )
            : date.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short"
                }
              ),

        date: dateKey,

        amount

      });

    }


    return result;

  }, [
    orders,
    chartRange,
    vendor?.id
  ]);


  // ========================================
  // CHART MAX
  // ========================================

  const chartMax = Math.max(
    ...chartData.map(
      (item) => item.amount
    ),
    100
  );


  // ========================================
  // SVG CHART POINTS
  // ========================================

  const chartPoints = chartData.map(
    (item, index) => {

      const width = 720;

      const height = 250;

      const x =
        chartData.length === 1
          ? width / 2
          : (index /
              (chartData.length - 1)) *
            width;


      const y =
        height -
        (item.amount / chartMax) *
          height;


      return {
        ...item,
        x,
        y
      };

    }
  );


  const linePath =
    chartPoints.length > 0
      ? chartPoints
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"} ${
                point.x
              } ${point.y}`
          )
          .join(" ")
      : "";


  const areaPath =
    chartPoints.length > 0
      ? `${linePath}
         L 720 250
         L 0 250
         Z`
      : "";


  // ========================================
  // STATUS ICON
  // ========================================

  const getStatusIcon = (
    status: string
  ) => {

    switch (status) {

      case "PENDING":
        return <Clock3 size={17} />;

      case "CONFIRMED":
        return <CheckCircle2 size={17} />;

      case "PROCESSING":
        return <Boxes size={17} />;

      case "SHIPPED":
        return <Truck size={17} />;

      case "DELIVERED":
        return <CheckCircle2 size={17} />;

      case "CANCELLED":
        return <XCircle size={17} />;

      default:
        return <Package size={17} />;

    }

  };


  // ========================================
  // STATUS CLASS
  // ========================================

  const getStatusClass = (
    status: string
  ) => {

    switch (status) {

      case "PENDING":
        return "status-pending";

      case "CONFIRMED":
        return "status-confirmed";

      case "PROCESSING":
        return "status-processing";

      case "SHIPPED":
        return "status-shipped";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "";

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="vendor-dashboard-loading">

        <RefreshCw
          size={22}
          className="dashboard-spin"
        />

        Loading vendor dashboard...

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !dashboard) {

    return (

      <div className="vendor-dashboard-error">

        <AlertTriangle size={30} />

        <h2>
          Dashboard unavailable
        </h2>

        <p>
          {error || "Something went wrong"}
        </p>

        <button
          onClick={() =>
            loadDashboard()
          }
        >
          Try Again
        </button>

      </div>

    );

  }


  // ========================================
  // DASHBOARD UI
  // ========================================

  return (

    <div className="vendor-dashboard">


      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside
        className={
          sidebarOpen
            ? "vendor-sidebar open"
            : "vendor-sidebar"
        }
      >


        <div className="sidebar-logo">

          SHOP<span>FLOW</span>

        </div>


        <div className="sidebar-vendor">

          <div className="sidebar-avatar">

            {vendorName
              .charAt(0)
              .toUpperCase()}

          </div>

          <div>

            <strong>
              {vendorName}
            </strong>

            <span>
              Vendor Account
            </span>

          </div>

        </div>


        <div className="sidebar-section-title">
          MAIN
        </div>


        <nav className="sidebar-nav">


          <button
            className="sidebar-nav-item active"
            onClick={() => {
              navigate("/vendor/dashboard");
              setSidebarOpen(false);
            }}
          >

            <LayoutDashboard size={18} />

            Dashboard

          </button>


          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigate("/vendor/products");
              setSidebarOpen(false);
            }}
          >

            <Package size={18} />

            Products

          </button>


          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigate("/vendor/orders");
              setSidebarOpen(false);
            }}
          >

            <ShoppingBag size={18} />

            Orders

            <span className="sidebar-count">

              {dashboard.totalOrders}

            </span>

          </button>


          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigate("/vendor/profile");
              setSidebarOpen(false);
            }}
          >

            <UserRound size={18} />

            Profile

          </button>

        </nav>


        <div className="sidebar-section-title">
          STORE
        </div>


        <nav className="sidebar-nav">


          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigate(
                "/vendor/products/create"
              );
              setSidebarOpen(false);
            }}
          >

            <Boxes size={18} />

            Add Product

          </button>


          <button
            className="sidebar-nav-item"
            onClick={() => {
              navigate("/vendor/orders");
              setSidebarOpen(false);
            }}
          >

            <Truck size={18} />

            Fulfillment

          </button>

        </nav>


        <div className="sidebar-bottom">

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>



      {/* ==================================
          MOBILE OVERLAY
      ================================== */}

      {sidebarOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}



      {/* ==================================
          MAIN
      ================================== */}

      <main className="vendor-dashboard-main">


        {/* ==================================
            TOPBAR
        ================================== */}

        <header className="dashboard-topbar">


          <button
            className="mobile-menu-toggle"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >

            {sidebarOpen
              ? <X size={21} />
              : <Menu size={21} />
            }

          </button>


          <div className="dashboard-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="dashboard-top-actions">


            <button
              className="top-icon-button"
              title="Notifications"
            >

              <Bell size={18} />

              <span className="notification-dot" />

            </button>


            <button
              className="top-profile"
              onClick={() =>
                navigate("/vendor/profile")
              }
            >

              <div className="top-avatar">

                {vendorName
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <strong>
                  {vendorName}
                </strong>

                <span>
                  Vendor
                </span>

              </div>

            </button>

          </div>

        </header>



        {/* ==================================
            CONTENT
        ================================== */}

        <div className="dashboard-content">


          {/* ==================================
              PAGE HEADER
          ================================== */}

          <div className="dashboard-page-header">

            <div>

              <span className="dashboard-eyebrow">
                SHOPFLOW VENDOR
              </span>

              <h1>
                Dashboard
              </h1>

              <p>
                Welcome back, {vendorName}.
                Here's what's happening with
                your store.
              </p>

            </div>


            <div className="dashboard-header-actions">

              <button
                className="dashboard-refresh-button"
                onClick={() =>
                  loadDashboard(true)
                }
                disabled={refreshing}
              >

                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "dashboard-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>


              <button
                className="add-product-dashboard"
                onClick={() =>
                  navigate(
                    "/vendor/products/create"
                  )
                }
              >

                + Add Product

              </button>

            </div>

          </div>



          {/* ==================================
              STAT CARDS
          ================================== */}

          <section className="dashboard-stat-grid">


            {/* PRODUCTS */}

            <div
              className="dashboard-stat-card clickable"
              onClick={() =>
                navigate("/vendor/products")
              }
            >

              <div className="stat-card-top">

                <div className="stat-icon black">
                  <Package size={19} />
                </div>

                <span className="stat-trend neutral">
                  Store
                </span>

              </div>

              <span className="stat-label">
                Total Products
              </span>

              <strong className="stat-value">
                {dashboard.totalProducts}
              </strong>

              <span className="stat-description">
                Products listed in your store
              </span>

            </div>



            {/* SALES */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-icon purple">
                  <CircleDollarSign size={19} />
                </div>

                <span className="stat-trend positive">
                  <ArrowUpRight size={14} />
                  Sales
                </span>

              </div>

              <span className="stat-label">
                Total Sales
              </span>

              <strong className="stat-value">

                ₹{vendorSales.toLocaleString(
                  "en-IN"
                )}

              </strong>

              <span className="stat-description">
                Based on your order items
              </span>

            </div>



            {/* STOCK */}

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-icon blue">
                  <Boxes size={19} />
                </div>

                <span className="stat-trend neutral">
                  Inventory
                </span>

              </div>

              <span className="stat-label">
                Total Stock
              </span>

              <strong className="stat-value">
                {dashboard.totalStock}
              </strong>

              <span className="stat-description">
                Units currently available
              </span>

            </div>



            {/* ORDERS */}

            <div
              className="dashboard-stat-card clickable"
              onClick={() =>
                navigate("/vendor/orders")
              }
            >

              <div className="stat-card-top">

                <div className="stat-icon green">
                  <ShoppingBag size={19} />
                </div>

                <span className="stat-trend positive">
                  Orders
                </span>

              </div>

              <span className="stat-label">
                Total Orders
              </span>

              <strong className="stat-value">
                {dashboard.totalOrders}
              </strong>

              <span className="stat-description">
                Orders containing your products
              </span>

            </div>

          </section>



          {/* ==================================
              SALES CHART
          ================================== */}

          <section className="dashboard-panel sales-panel">


            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  ANALYTICS
                </span>

                <h2>
                  Sales Overview
                </h2>

                <p>
                  Track your store sales over time.
                </p>

              </div>


              <div className="chart-controls">

                <button
                  className={
                    chartRange === "7D"
                      ? "chart-range active"
                      : "chart-range"
                  }
                  onClick={() =>
                    setChartRange("7D")
                  }
                >
                  7 Days
                </button>

                <button
                  className={
                    chartRange === "30D"
                      ? "chart-range active"
                      : "chart-range"
                  }
                  onClick={() =>
                    setChartRange("30D")
                  }
                >
                  30 Days
                </button>

              </div>

            </div>


            <div className="sales-chart">

              <div className="chart-y-labels">

                <span>
                  ₹{Math.round(
                    chartMax
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  ₹{Math.round(
                    chartMax * 0.75
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  ₹{Math.round(
                    chartMax * 0.5
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  ₹{Math.round(
                    chartMax * 0.25
                  ).toLocaleString("en-IN")}
                </span>

                <span>
                  ₹0
                </span>

              </div>


              <div className="chart-area">

                <div className="chart-grid-lines">

                  <span />
                  <span />
                  <span />
                  <span />
                  <span />

                </div>


                <svg
                  viewBox="0 0 720 250"
                  preserveAspectRatio="none"
                  className="sales-svg"
                >

                  <defs>

                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#111"
                        stopOpacity="0.22"
                      />

                      <stop
                        offset="100%"
                        stopColor="#111"
                        stopOpacity="0"
                      />

                    </linearGradient>

                  </defs>


                  <path
                    d={areaPath}
                    fill="url(#salesGradient)"
                  />


                  <path
                    d={linePath}
                    fill="none"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />


                  {chartPoints.map(
                    (point) => (

                      <g key={point.date}>

                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill="#fff"
                          stroke="#111"
                          strokeWidth="3"
                        />

                      </g>

                    )
                  )}

                </svg>


                <div className="chart-tooltip-row">

                  {chartPoints.map(
                    (point) => (

                      <div
                        key={point.date}
                        className="chart-point-info"
                      >

                        <strong>
                          ₹{point.amount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <span>
                          {point.label}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>



          {/* ==================================
              LOWER GRID
          ================================== */}

          <div className="dashboard-lower-grid">


            {/* ==================================
                ORDER SUMMARY
            ================================== */}

            <section className="dashboard-panel order-summary-panel">


              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    ORDER MANAGEMENT
                  </span>

                  <h2>
                    Order Summary
                  </h2>

                </div>


                <button
                  className="view-all-button"
                  onClick={() =>
                    navigate("/vendor/orders")
                  }
                >

                  View all

                  <ArrowUpRight size={15} />

                </button>

              </div>


              <div className="order-summary-grid">


                <div className="summary-status pending">

                  <div className="summary-icon">
                    <Clock3 size={18} />
                  </div>

                  <strong>
                    {dashboard.orderStatus.pending}
                  </strong>

                  <span>
                    Pending
                  </span>

                </div>


                <div className="summary-status processing">

                  <div className="summary-icon">
                    <Boxes size={18} />
                  </div>

                  <strong>
                    {dashboard.orderStatus.processing}
                  </strong>

                  <span>
                    Processing
                  </span>

                </div>


                <div className="summary-status shipped">

                  <div className="summary-icon">
                    <Truck size={18} />
                  </div>

                  <strong>
                    {dashboard.orderStatus.shipped}
                  </strong>

                  <span>
                    Shipped
                  </span>

                </div>


                <div className="summary-status delivered">

                  <div className="summary-icon">
                    <CheckCircle2 size={18} />
                  </div>

                  <strong>
                    {dashboard.orderStatus.delivered}
                  </strong>

                  <span>
                    Delivered
                  </span>

                </div>


                <div className="summary-status cancelled">

                  <div className="summary-icon">
                    <XCircle size={18} />
                  </div>

                  <strong>
                    {dashboard.orderStatus.cancelled}
                  </strong>

                  <span>
                    Cancelled
                  </span>

                </div>

              </div>

            </section>



            {/* ==================================
                LOW STOCK
            ================================== */}

            <section className="dashboard-panel low-stock-panel">


              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    INVENTORY
                  </span>

                  <h2>
                    Low Stock
                  </h2>

                </div>


                <button
                  className="view-all-button"
                  onClick={() =>
                    navigate("/vendor/products")
                  }
                >

                  Products

                  <ChevronRight size={15} />

                </button>

              </div>


              {lowStockProducts.length === 0 ? (

                <div className="no-low-stock">

                  <CheckCircle2 size={23} />

                  <strong>
                    Inventory looks good
                  </strong>

                  <span>
                    No products are running low.
                  </span>

                </div>

              ) : (

                <div className="low-stock-list">

                  {lowStockProducts.map(
                    (product) => (

                      <div
                        className="low-stock-item"
                        key={product._id}
                      >

                        <div className="low-stock-image">

                          {product.image ? (

                            <img
                              src={product.image}
                              alt={product.name}
                            />

                          ) : (

                            <Package size={18} />

                          )}

                        </div>


                        <div className="low-stock-info">

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            ₹{product.price.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>


                        <div className="stock-warning">

                          <AlertTriangle
                            size={14}
                          />

                          {product.stock}
                          {" "}left

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </div>



          {/* ==================================
              RECENT ORDERS
          ================================== */}

          <section className="dashboard-panel recent-orders-panel">


            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  RECENT ACTIVITY
                </span>

                <h2>
                  Recent Orders
                </h2>

                <p>
                  Latest orders containing your products.
                </p>

              </div>


              <button
                className="view-all-button"
                onClick={() =>
                  navigate("/vendor/orders")
                }
              >

                View all orders

                <ArrowUpRight size={15} />

              </button>

            </div>


            {recentOrders.length === 0 ? (

              <div className="empty-orders">

                <ShoppingBag size={30} />

                <strong>
                  No orders found
                </strong>

                <span>
                  Your recent orders will appear here.
                </span>

              </div>

            ) : (

              <div className="orders-table-wrapper">

                <table className="dashboard-orders-table">

                  <thead>

                    <tr>

                      <th>
                        ORDER
                      </th>

                      <th>
                        CUSTOMER
                      </th>

                      <th>
                        DATE
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        AMOUNT
                      </th>

                      <th>
                        ACTION
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentOrders.map(
                      (order) => {

                        const vendorAmount =
                          vendor?.id
                            ? order.items
                                .filter(
                                  (item) =>
                                    item.vendor?._id ===
                                    vendor.id
                                )
                                .reduce(
                                  (sum, item) =>
                                    sum +
                                    item.subtotal,
                                  0
                                )
                            : order.totalAmount;


                        return (

                          <tr key={order._id}>

                            <td>

                              <strong className="order-number">

                                #
                                {order._id
                                  .slice(-8)
                                  .toUpperCase()}

                              </strong>

                            </td>


                            <td>

                              <div className="customer-cell">

                                <div className="customer-avatar">

                                  {(
                                    order.user?.name ||
                                    "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <strong>
                                    {
                                      order.user?.name ||
                                      "Customer"
                                    }
                                  </strong>

                                  <span>
                                    {
                                      order.user?.email ||
                                      "-"
                                    }
                                  </span>

                                </div>

                              </div>

                            </td>


                            <td>

                              <span className="table-date">

                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                  }
                                )}

                              </span>

                            </td>


                            <td>

                              <span
                                className={`order-status-badge ${getStatusClass(
                                  order.status
                                )}`}
                              >

                                {
                                  getStatusIcon(
                                    order.status
                                  )
                                }

                                {order.status}

                              </span>

                            </td>


                            <td>

                              <strong>

                                ₹{vendorAmount.toLocaleString(
                                  "en-IN"
                                )}

                              </strong>

                            </td>


                            <td>

                              <button
                                className="table-action-button"
                                onClick={() =>
                                  navigate(
                                    "/vendor/orders"
                                  )
                                }
                              >

                                <ChevronRight
                                  size={17}
                                />

                              </button>

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>



          {/* ==================================
              QUICK ACTIONS
          ================================== */}

          <section className="quick-actions-section">


            <div className="quick-section-heading">

              <div>

                <span className="panel-eyebrow">
                  STORE MANAGEMENT
                </span>

                <h2>
                  Quick Actions
                </h2>

              </div>

            </div>


            <div className="quick-actions-grid">


              <button
                className="quick-action-card"
                onClick={() =>
                  navigate(
                    "/vendor/products/create"
                  )
                }
              >

                <div className="quick-action-icon">
                  <Package size={20} />
                </div>

                <div>

                  <strong>
                    Add Product
                  </strong>

                  <span>
                    Create a new product
                  </span>

                </div>

                <ArrowUpRight size={17} />

              </button>


              <button
                className="quick-action-card"
                onClick={() =>
                  navigate("/vendor/orders")
                }
              >

                <div className="quick-action-icon">
                  <ShoppingBag size={20} />
                </div>

                <div>

                  <strong>
                    Manage Orders
                  </strong>

                  <span>
                    View and update orders
                  </span>

                </div>

                <ArrowUpRight size={17} />

              </button>


              <button
                className="quick-action-card"
                onClick={() =>
                  navigate("/vendor/products")
                }
              >

                <div className="quick-action-icon">
                  <Boxes size={20} />
                </div>

                <div>

                  <strong>
                    Inventory
                  </strong>

                  <span>
                    Manage your stock
                  </span>

                </div>

                <ArrowUpRight size={17} />

              </button>


              <button
                className="quick-action-card"
                onClick={() =>
                  navigate("/vendor/profile")
                }
              >

                <div className="quick-action-icon">
                  <UserRound size={20} />
                </div>

                <div>

                  <strong>
                    Vendor Profile
                  </strong>

                  <span>
                    View business information
                  </span>

                </div>

                <ArrowUpRight size={17} />

              </button>

            </div>

          </section>


        </div>

      </main>

    </div>

  );

};


export default VendorDashboard;