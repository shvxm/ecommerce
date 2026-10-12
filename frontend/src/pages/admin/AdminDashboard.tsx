import {
  Users,
  Store,
  Package,
  Boxes,
  ShoppingCart,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Menu,
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAdminDashboard } from "../../services/adminApi";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] =
    useState<Awaited<ReturnType<typeof getAdminDashboard>> | null>(
      null
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="admin-main">
          <div className="admin-loading">
            <RefreshCw
              size={28}
              className="loading-icon"
            />

            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="admin-layout">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="admin-main">
          <div className="admin-mobile-header">
            <button
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <strong>Admin Dashboard</strong>
          </div>

          <div className="admin-error">
            <XCircle size={32} />

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-main">

        {/* MOBILE HEADER */}

        <div className="admin-mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <strong>Admin Dashboard</strong>
        </div>

        {/* HEADER */}

        <header className="admin-page-header">
          <div>
            <span className="admin-eyebrow">
              SHOPFLOW ADMIN
            </span>

            <h1>Dashboard</h1>

            <p>
              Overview of your e-commerce platform.
            </p>
          </div>

          <button
            className="refresh-dashboard"
            onClick={loadDashboard}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* PRIMARY STATS */}

        <section className="admin-stats-grid">

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span>Total Users</span>

              <div className="stat-icon">
                <Users size={19} />
              </div>
            </div>

            <strong>{dashboard.users.total}</strong>

            <small>
              Registered customers
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span>Total Vendors</span>

              <div className="stat-icon">
                <Store size={19} />
              </div>
            </div>

            <strong>{dashboard.vendors.total}</strong>

            <small>
              {dashboard.vendors.approved} approved
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span>Total Products</span>

              <div className="stat-icon">
                <Package size={19} />
              </div>
            </div>

            <strong>{dashboard.products.total}</strong>

            <small>
              {dashboard.products.active} active products
            </small>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-top">
              <span>Total Stock</span>

              <div className="stat-icon">
                <Boxes size={19} />
              </div>
            </div>

            <strong>
              {dashboard.inventory.totalStock}
            </strong>

            <small>
              Units currently available
            </small>
          </div>

        </section>

        {/* SECOND ROW */}

        <section className="admin-content-grid">

          {/* VENDOR OVERVIEW */}

          <div className="admin-panel">

            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  VENDORS
                </span>

                <h2>Vendor Overview</h2>
              </div>

              <Store size={20} />
            </div>

            <div className="vendor-overview">

              <div className="vendor-number">
                <strong>
                  {dashboard.vendors.total}
                </strong>

                <span>Total Vendors</span>
              </div>

              <div className="vendor-status-row">

                <div>
                  <span className="status-dot approved" />

                  <span>Approved</span>

                  <strong>
                    {dashboard.vendors.approved}
                  </strong>
                </div>

                <div>
                  <span className="status-dot pending" />

                  <span>Pending</span>

                  <strong>
                    {dashboard.vendors.pending}
                  </strong>
                </div>

              </div>

            </div>

          </div>

          {/* PRODUCTS */}

          <div className="admin-panel">

            <div className="panel-header">
              <div>
                <span className="panel-eyebrow">
                  PRODUCTS
                </span>

                <h2>Product Overview</h2>
              </div>

              <Package size={20} />
            </div>

            <div className="product-overview">

              <div className="product-main-number">
                <strong>
                  {dashboard.products.total}
                </strong>

                <span>Total Products</span>
              </div>

              <div className="active-product">

                <CheckCircle2 size={20} />

                <div>
                  <strong>
                    {dashboard.products.active}
                  </strong>

                  <span>
                    Active products
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ORDER OVERVIEW */}

        <section className="admin-panel orders-panel">

          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                ORDERS
              </span>

              <h2>Order Overview</h2>
            </div>

            <ShoppingCart size={20} />
          </div>

          <div className="order-stats">

            <div className="order-stat">
              <Clock3 size={18} />

              <div>
                <strong>
                  {dashboard.orders.pending}
                </strong>

                <span>Pending</span>
              </div>
            </div>

            <div className="order-stat">
              <CheckCircle2 size={18} />

              <div>
                <strong>
                  {dashboard.orders.confirmed}
                </strong>

                <span>Confirmed</span>
              </div>
            </div>

            <div className="order-stat">
              <Package size={18} />

              <div>
                <strong>
                  {dashboard.orders.processing}
                </strong>

                <span>Processing</span>
              </div>
            </div>

            <div className="order-stat">
              <Truck size={18} />

              <div>
                <strong>
                  {dashboard.orders.shipped}
                </strong>

                <span>Shipped</span>
              </div>
            </div>

            <div className="order-stat">
              <CheckCircle2 size={18} />

              <div>
                <strong>
                  {dashboard.orders.delivered}
                </strong>

                <span>Delivered</span>
              </div>
            </div>

            <div className="order-stat">
              <XCircle size={18} />

              <div>
                <strong>
                  {dashboard.orders.cancelled}
                </strong>

                <span>Cancelled</span>
              </div>
            </div>

          </div>

          <div className="total-orders">

            <span>Total Orders</span>

            <strong>
              {dashboard.orders.total}
            </strong>

          </div>

        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;