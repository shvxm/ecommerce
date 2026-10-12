import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Package,
  LayoutDashboard,
  Store,
  Heart,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { getCart } from "../../services/cartApi";

import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ========================================
  // CHECK WHETHER WE ARE ON VENDOR PAGE
  // ========================================

  const isVendorPage =
    location.pathname.startsWith("/vendor");

  // ========================================
  // USER AUTH DATA
  // ========================================

  const userToken =
    localStorage.getItem("token");

  const user =
    localStorage.getItem("user");

  // ========================================
  // VENDOR AUTH DATA
  // ========================================

  const vendorToken =
    localStorage.getItem("vendorToken");

  const vendor =
    localStorage.getItem("vendor");

  // ========================================
  // USER DATA
  // ========================================

  let userData: {
    name?: string;
    role?: string;
  } | null = null;

  try {
    userData = user
      ? JSON.parse(user)
      : null;
  } catch {
    userData = null;
  }

  // ========================================
  // VENDOR DATA
  // ========================================

  let vendorData: {
    id?: string;
    businessName?: string;
    ownerName?: string;
    email?: string;
    role?: string;
  } | null = null;

  try {
    vendorData = vendor
      ? JSON.parse(vendor)
      : null;
  } catch {
    vendorData = null;
  }

  // ========================================
  // STATES
  // ========================================

  const [cartCount, setCartCount] =
    useState(0);

  const [menuOpen, setMenuOpen] =
    useState(false);

  // ========================================
  // LOAD CART COUNT
  // ========================================

  useEffect(() => {
    const loadCartCount = async () => {
      // Vendor does not use user cart
      if (isVendorPage) {
        setCartCount(0);
        return;
      }

      // User is not logged in
      if (!userToken) {
        setCartCount(0);
        return;
      }

      try {
        const cart = await getCart();

        setCartCount(cart.totalItems || 0);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [
    userToken,
    location.pathname,
    isVendorPage,
  ]);

  // ========================================
  // ACTIVE LINK
  // ========================================

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // ========================================
  // USER LOGOUT
  // ========================================

  const handleUserLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCartCount(0);
    setMenuOpen(false);

    navigate("/");
  };

  // ========================================
  // VENDOR LOGOUT
  // ========================================

  const handleVendorLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendor");

    setMenuOpen(false);

    navigate("/vendor/login");
  };

  // ========================================
  // VENDOR NAVBAR
  // ========================================

  if (isVendorPage) {
    return (
      <header className="shopflow-navbar">

        <div className="navbar-inner">

          {/* LOGO */}

          <Link
            to="/vendor/dashboard"
            className="shopflow-logo"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            SHOP<span>FLOW</span>
          </Link>

          {/* DESKTOP VENDOR NAVIGATION */}

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
                location.pathname.startsWith(
                  "/vendor/products"
                )
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Products
            </Link>

            <Link
              to="/vendor/orders"
              className={
                location.pathname.startsWith(
                  "/vendor/orders"
                )
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Orders
            </Link>

            <Link
              to="/vendor/profile"
              className={
                location.pathname.startsWith(
                  "/vendor/profile"
                )
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Profile
            </Link>

          </nav>

          {/* VENDOR ACTIONS */}

          <div className="navbar-actions">

            {/* DASHBOARD */}

            <button
              className="navbar-icon-button"
              onClick={() =>
                navigate("/vendor/dashboard")
              }
              aria-label="Dashboard"
              title="Dashboard"
            >
              <LayoutDashboard size={18} />
            </button>

            {/* VENDOR ACCOUNT */}

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
                  onClick={handleVendorLogout}
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

            {/* MOBILE MENU */}

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
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

        {/* VENDOR MOBILE MENU */}

        {menuOpen && (
          <div className="mobile-navigation">

            <Link
              to="/vendor/dashboard"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              to="/vendor/products"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <Package size={16} />
              Products
            </Link>

            <Link
              to="/vendor/orders"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <ShoppingBag size={16} />
              Orders
            </Link>

            <Link
              to="/vendor/profile"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <UserRound size={16} />
              Profile
            </Link>

            {vendorToken && (
              <button
                className="mobile-logout-button"
                onClick={handleVendorLogout}
              >
                Logout
              </button>
            )}

          </div>
        )}

      </header>
    );
  }

  // ========================================
  // USER NAVBAR
  // ========================================

  return (
    <header className="shopflow-navbar">

      <div className="navbar-inner">

        {/* ==================================
            LOGO
        ================================== */}

        <Link
          to="/"
          className="shopflow-logo"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          SHOP<span>FLOW</span>
        </Link>

        {/* ==================================
            DESKTOP USER NAVIGATION
        ================================== */}

        <nav className="desktop-navigation">

          <Link
            to="/"
            className={
              isActive("/")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </Link>

          <Link
            to="/products"
            className={
              location.pathname.startsWith(
                "/products"
              )
                ? "nav-link active"
                : "nav-link"
            }
          >
            Shop
          </Link>

          <Link
            to="/products"
            className="nav-link"
          >
            Collections
          </Link>

          <Link
            to="/products"
            className="nav-link"
          >
            New Arrivals
          </Link>

        </nav>

        {/* ==================================
            USER ACTIONS
        ================================== */}

        <div className="navbar-actions">

          {/* SEARCH */}

          <button
            className="navbar-icon-button"
            onClick={() =>
              navigate("/products")
            }
            aria-label="Search"
            title="Search Products"
          >
            <Search size={19} />
          </button>

          {/* ORDERS */}

          {userToken && (
            <Link
              to="/orders"
              className="orders-nav-link"
            >
              Orders
            </Link>
          )}

          {/* ==================================
              WISHLIST
          ================================== */}

          <Link
            to={
              userToken
                ? "/wishlist"
                : "/login"
            }
            className="orders-nav-link wishlist-nav-link"
            title="Wishlist"
          >
            <Heart
              size={18}
              fill={
                location.pathname ===
                "/wishlist"
                  ? "currentColor"
                  : "none"
              }
            />

            <span>
              Wishlist
            </span>
          </Link>

          {/* USER ACCOUNT */}

          {userToken ? (
            <div className="user-menu-wrapper">

              <button
                className="user-button"
                onClick={() =>
                  navigate("/profile")
                }
                aria-label="Profile"
              >
                <UserRound size={18} />

                <span>
                  {userData?.name ||
                    "Account"}
                </span>
              </button>

              <button
                className="logout-button"
                onClick={handleUserLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>
          )}

          {/* CART */}

          <Link
            to="/cart"
            className="cart-button"
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
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

      {/* ==================================
          USER MOBILE MENU
      ================================== */}

      {menuOpen && (
        <div className="mobile-navigation">

          {/* HOME */}

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <LayoutDashboard size={16} />
            Home
          </Link>

          {/* SHOP */}

          <Link
            to="/products"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <Package size={16} />
            Shop
          </Link>

          {/* COLLECTIONS */}

          <Link
            to="/products"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Collections
          </Link>

          {/* NEW ARRIVALS */}

          <Link
            to="/products"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            New Arrivals
          </Link>

          {/* MY ORDERS */}

          {userToken && (
            <Link
              to="/orders"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <ShoppingBag size={16} />
              My Orders
            </Link>
          )}

          {/* ==================================
              WISHLIST
          ================================== */}

          <Link
            to={
              userToken
                ? "/wishlist"
                : "/login"
            }
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <Heart size={16} />
            Wishlist
          </Link>

          {/* PROFILE */}

          {userToken && (
            <Link
              to="/profile"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              <UserRound size={16} />
              My Profile
            </Link>
          )}

          {/* LOGOUT */}

          {userToken && (
            <button
              className="mobile-logout-button"
              onClick={handleUserLogout}
            >
              Logout
            </button>
          )}

          {/* LOGIN */}

          {!userToken && (
            <Link
              to="/login"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Login
            </Link>
          )}

        </div>
      )}

    </header>
  );
};

export default Navbar;