import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Lock,
  Mail,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginVendor } from "../../services/vendorApi";

import "./VendorLogin.css";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginVendor({
        email: email.trim(),
        password,
      });

      // Save vendor authentication token
      localStorage.setItem(
        "vendorToken",
        response.data.token
      );

      // Save vendor information
      localStorage.setItem(
        "vendor",
        JSON.stringify(response.data.vendor)
      );

      // Redirect to vendor dashboard
      navigate("/vendor/dashboard");

    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        "Vendor login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-login-page">

      {/* =================================
          LEFT SECTION
      ================================= */}

      <div className="vendor-login-left">

        <div className="vendor-login-brand">
          SHOP<span>FLOW</span>
        </div>

        <div className="vendor-login-left-content">

          <span className="vendor-login-eyebrow">
            SHOPFLOW VENDOR
          </span>

          <h1>
            Manage your store.
            <br />
            Grow your business.
          </h1>

          <p>
            Access your vendor dashboard to manage
            products, inventory and customer orders
            from one place.
          </p>

          <div className="vendor-login-features">

            <div className="vendor-login-feature">
              <div className="vendor-feature-icon">
                <Store size={18} />
              </div>

              <div>
                <strong>
                  Manage Products
                </strong>

                <span>
                  Create, update and manage your products.
                </span>
              </div>
            </div>

            <div className="vendor-login-feature">
              <div className="vendor-feature-icon">
                <ArrowRight size={18} />
              </div>

              <div>
                <strong>
                  Manage Orders
                </strong>

                <span>
                  Track and update your customer orders.
                </span>
              </div>
            </div>

          </div>

        </div>

        <div className="vendor-login-left-footer">
          © 2026 SHOPFLOW
        </div>

      </div>


      {/* =================================
          RIGHT LOGIN SECTION
      ================================= */}

      <div className="vendor-login-right">

        <div className="vendor-login-card">

          {/* Header */}

          <div className="vendor-login-header">

            <div className="vendor-login-mobile-logo">
              SHOP<span>FLOW</span>
            </div>

            <span className="vendor-login-label">
              VENDOR PORTAL
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to manage your store.
            </p>

          </div>


          {/* Login Form */}

          <form
            className="vendor-login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="vendor-form-group">

              <label>
                Email Address
              </label>

              <div className="vendor-input-wrapper">

                <Mail size={17} />

                <input
                  type="email"
                  placeholder="vendor@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}

            <div className="vendor-form-group">

              <label>
                Password
              </label>

              <div className="vendor-input-wrapper">

                <Lock size={17} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

              </div>

            </div>


            {/* Error */}

            {error && (
              <div className="vendor-login-error">
                {error}
              </div>
            )}


            {/* Login Button */}

            <button
              type="submit"
              className="vendor-login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In"
              }

              {!loading && (
                <ArrowRight size={17} />
              )}

            </button>

          </form>


          {/* Register */}

          <div className="vendor-login-footer">

            <span>
              Want to sell on SHOPFLOW?
            </span>

            <Link to="/vendor/register">
              Register
            </Link>

          </div>


          {/* User Login */}

          <div className="vendor-user-login">

            <span>
              Looking for customer login?
            </span>

            <Link to="/login">
              Customer Login
            </Link>

          </div>


          {/* Approval Note */}

          <div className="vendor-login-note">

            <strong>
              New vendor?
            </strong>

            <span>
              Your account must be approved by an
              admin before you can sign in.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default VendorLogin;