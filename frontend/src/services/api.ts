
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    /*
      Check which section of the application
      the user is currently accessing.
    */

    const currentPath = window.location.pathname;

    let token = null;

    /*
      USER section
      Example:
      /products
      /cart
      /orders
      /wishlist
    */

    if (!currentPath.startsWith("/vendor") && !currentPath.startsWith("/admin")) {
      token = localStorage.getItem("token");
    }

    /*
      VENDOR section
      Example:
      /vendor/dashboard
      /vendor/products
      /vendor/orders
    */

    if (currentPath.startsWith("/vendor")) {
      token = localStorage.getItem("vendorToken");
    }

    /*
      ADMIN section
      Example:
      /admin/dashboard
      /admin/users
      /admin/orders
    */

    if (currentPath.startsWith("/admin")) {
      token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");
    }

    /*
      If a token exists,
      attach it to the Authorization header.
    */

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;