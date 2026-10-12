import {
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Package,
  LayoutDashboard,
  Store,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import "./Navbar.css";

const VendorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const vendorToken = localStorage.getItem("vendorToken");
  const vendor = localStorage.getItem("vendor");

  let vendorData: {
    id?: string;
    businessName?: string;
    ownerName?: string;
    email?: string;
    role?: string;
  } | null = null;

  try {
    vendorData = vendor ? JSON.parse(vendor) : null;
  } catch {
    vendorData = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendor");

    setMenuOpen(false);

    navigate("/vendor/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="shopflow-navbar">
      <div className="navbar-inner">

        {/* LOGO */}

        <Link
          to="/vendor/dashboard"
          className="shopflow-logo"
          onClick={() => setMenuOpen(false)}
        >
          SHOP<span>FLOW</span>
        </Link>

        {/* VENDOR NAVIGATION */}

        <nav className="desktop-navigation">

          <Link
            to="/vendor/dashboard"
            className={
              isActive("/vendor/dashboard")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Dashboard
          </Link>

          <Link
            to="/vendor/products"
            className={
              location.pathname.startsWith("/vendor/products")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Products
          </Link>

          <Link
            to="/vendor/orders"
            className={
              location.pathname.startsWith("/vendor/orders")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Orders
          </Link>

          <Link
            to="/vendor/profile"
            className={
              location.pathname.startsWith("/vendor/profile")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Profile
          </Link>

        </nav>

        {/* VENDOR ACTIONS */}

        <div className="navbar-actions">

          <button
            className="navbar-icon-button"
            onClick={() =>
              navigate("/vendor/dashboard")
            }
            aria-label="Vendor Dashboard"
          >
            <LayoutDashboard size={18} />
          </button>

          {vendorToken ? (
            <div className="user-menu-wrapper">

              <button
                className="user-button"
                onClick={() =>
                  navigate("/vendor/profile")
                }
              >
                <Store size={18} />

                <span>
                  {vendorData?.businessName ||
                    vendorData?.ownerName ||
                    "Vendor"}
                </span>
              </button>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              to="/vendor/login"
              className="login-button"
            >
              Vendor Login
            </Link>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </div>

      {/* MOBILE VENDOR NAVIGATION */}

      {menuOpen && (
        <div className="mobile-navigation">

          <Link
            to="/vendor/dashboard"
            onClick={() => setMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link
            to="/vendor/products"
            onClick={() => setMenuOpen(false)}
          >
            <Package size={16} />
            Products
          </Link>

          <Link
            to="/vendor/orders"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag size={16} />
            Orders
          </Link>

          <Link
            to="/vendor/profile"
            onClick={() => setMenuOpen(false)}
          >
            <UserRound size={16} />
            Profile
          </Link>

          {vendorToken && (
            <button
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>
      )}
    </header>
  );
};

export default VendorNavbar;