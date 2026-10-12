import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Package,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { getCart } from "../../services/cartApi";

import "./Navbar.css";

const UserNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const userToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  let userData: {
    name?: string;
    role?: string;
  } | null = null;

  try {
    userData = user ? JSON.parse(user) : null;
  } catch {
    userData = null;
  }

  useEffect(() => {
    const loadCartCount = async () => {
      if (!userToken) {
        setCartCount(0);
        return;
      }

      try {
        const cart = await getCart();
        setCartCount(cart.totalItems);
      } catch {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [userToken, location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCartCount(0);
    setMenuOpen(false);

    navigate("/");
  };

  return (
    <header className="shopflow-navbar">
      <div className="navbar-inner">

        {/* LOGO */}

        <Link
          to="/"
          className="shopflow-logo"
          onClick={() => setMenuOpen(false)}
        >
          SHOP<span>FLOW</span>
        </Link>

        {/* DESKTOP NAVIGATION */}

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
              location.pathname.startsWith("/products")
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

        {/* USER ACTIONS */}

        <div className="navbar-actions">

          {/* SEARCH */}

          <button
            className="navbar-icon-button"
            onClick={() => navigate("/products")}
            aria-label="Search"
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

          {/* PROFILE */}

          {userToken ? (
            <div className="user-menu-wrapper">

              <button
                className="user-button"
                onClick={() => navigate("/profile")}
                aria-label="Profile"
              >
                <UserRound size={18} />

                <span>
                  {userData?.name || "Account"}
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
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* MOBILE MENU */}

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

      {/* MOBILE NAVIGATION */}

      {menuOpen && (
        <div className="mobile-navigation">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>

          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </Link>

          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
          >
            New Arrivals
          </Link>

          {userToken && (
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
            >
              <Package size={16} />
              My Orders
            </Link>
          )}

          {userToken && (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
            >
              <UserRound size={16} />
              My Profile
            </Link>
          )}

          {userToken && (
            <button
              className="mobile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          {!userToken && (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}

        </div>
      )}
    </header>
  );
};

export default UserNavbar;