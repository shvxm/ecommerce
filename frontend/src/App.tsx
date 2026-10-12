import { Routes, Route } from "react-router-dom";

// ========================================
// AUTH PAGES
// ========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ========================================
// USER PAGES
// ========================================

import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import Orders from "./pages/user/Orders";
import OrderDetails from "./pages/user/OrderDetails";
import Profile from "./pages/user/Profile";
import Addresses from "./pages/user/Addresses";
import Wishlist from "./pages/user/Wishlist";

// ========================================
// VENDOR PAGES
// ========================================

import VendorLogin from "./pages/vendor/VendorLogin";
import VendorRegister from "./pages/vendor/VendorRegister";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProfile from "./pages/vendor/VendorProfile";
import VendorProducts from "./pages/vendor/VendorProducts";
import CreateVendorProduct from "./pages/vendor/CreateVendorProduct";
import EditVendorProduct from "./pages/vendor/EditVendorProduct";
import VendorOrders from "./pages/vendor/VendorOrders";

// ========================================
// ADMIN PAGES
// ========================================

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminOrders from "./pages/admin/AdminOrders";

// ========================================
// LAYOUTS
// ========================================

import UserLayout from "./components/layout/UserLayout";
import VendorLayout from "./components/layout/VendorLayout";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Routes>

      {/* ======================================
          AUTH ROUTES
      ====================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/vendor/login"
        element={<VendorLogin />}
      />

      <Route
        path="/vendor/register"
        element={<VendorRegister />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ======================================
          USER ROUTES
      ====================================== */}

      <Route element={<UserLayout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* PRODUCTS */}

        <Route
          path="/products"
          element={<Products />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ORDER SUCCESS */}

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        {/* ORDERS */}

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* ORDER DETAILS */}

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* ADDRESSES */}

        <Route
          path="/addresses"
          element={<Addresses />}
        />

        {/* ==================================
            WISHLIST
        ================================== */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

      </Route>


      {/* ======================================
          VENDOR ROUTES
      ====================================== */}

      <Route
        path="/vendor"
        element={<VendorLayout />}
      >

        {/* VENDOR DASHBOARD */}

        <Route
          path="dashboard"
          element={<VendorDashboard />}
        />

        {/* VENDOR PROFILE */}

        <Route
          path="profile"
          element={<VendorProfile />}
        />

        {/* VENDOR PRODUCTS */}

        <Route
          path="products"
          element={<VendorProducts />}
        />

        {/* CREATE PRODUCT */}

        <Route
          path="products/create"
          element={<CreateVendorProduct />}
        />

        {/* EDIT PRODUCT */}

        <Route
          path="products/:id/edit"
          element={<EditVendorProduct />}
        />

        {/* VENDOR ORDERS */}

        <Route
          path="orders"
          element={<VendorOrders />}
        />

      </Route>


      {/* ======================================
          ADMIN ROUTES
      ====================================== */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* ADMIN DASHBOARD */}

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* USERS */}

        <Route
          path="users"
          element={<AdminUsers />}
        />

        {/* VENDORS */}

        <Route
          path="vendors"
          element={<AdminVendors />}
        />

        {/* PRODUCTS */}

        <Route
          path="products"
          element={<AdminProducts />}
        />

        {/* CATEGORIES */}

        <Route
          path="categories"
          element={<AdminCategories />}
        />

        {/* INVENTORY */}

        <Route
          path="inventory"
          element={<AdminInventory />}
        />

        {/* ORDERS */}

        <Route
          path="orders"
          element={<AdminOrders />}
        />

      </Route>


      {/* ======================================
          404 PAGE
      ====================================== */}

      <Route
        path="*"
        element={
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                marginBottom: "10px",
              }}
            >
              404
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#666",
              }}
            >
              Page not found.
            </p>
          </div>
        }
      />

    </Routes>
  );
}

export default App;