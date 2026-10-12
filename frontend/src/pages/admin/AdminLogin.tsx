import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "../../services/authApi";

import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Remove any old user authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Call backend login API
      const response = await loginUser(
        email.trim(),
        password
      );

      console.log("Admin login response:", response);

      const loggedInUser = response.data.user;

      // Security check:
      // Only ADMIN can enter this panel
      if (loggedInUser.role !== "ADMIN") {
        setError(
          "Access denied. Only administrators can login here."
        );
        return;
      }

      // Save fresh admin token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save admin information
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // Go to admin dashboard
      navigate("/admin/dashboard");

    } catch (error: any) {
      console.error("Admin login error:", error);

      setError(
        error?.response?.data?.message ||
        "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-header">

          <div className="admin-login-icon">
            <ShieldCheck size={28} />
          </div>

          <div className="admin-badge">
            ADMIN PANEL
          </div>

          <h1>Admin Login</h1>

          <p>
            Sign in to manage your ShopFlow store
          </p>

        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}

          <div className="admin-form-group">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-input-wrapper">

              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}

          <div className="admin-form-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <LockKeyhole size={18} />

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter admin password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In as Admin"}
          </button>

        </form>

        <div className="admin-login-footer">

          <Link to="/login">
            ← Back to User Login
          </Link>

        </div>

      </div>

    </main>
  );
};

export default AdminLogin;