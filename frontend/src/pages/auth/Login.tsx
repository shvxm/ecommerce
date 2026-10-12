import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { loginUser } from "../../services/authApi";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Remove old login information.
       */
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await loginUser(
        email.trim(),
        password
      );

      console.log(
        "Login response:",
        response
      );

      /*
       * Save NEW JWT token.
       */
      localStorage.setItem(
        "token",
        response.data.token
      );

      /*
       * Save logged-in user.
       */
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      /*
       * Get user's role.
       */
      const role =
        response.data.user.role;

      /*
       * Redirect according to role.
       */
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      if (role === "VENDOR") {
        navigate("/vendor/dashboard");
        return;
      }

      navigate("/");

    } catch (error: any) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* =====================================
          LEFT BRAND SECTION
      ===================================== */}

      <section className="login-brand">

        <div className="brand-glow brand-glow-one" />
        <div className="brand-glow brand-glow-two" />
        <div className="brand-pattern" />

        <div className="brand-content">

          {/* LOGO */}

          <Link
            to="/"
            className="login-logo"
          >

            <div className="login-logo-icon">
              <ShoppingBag size={20} />
            </div>

            <div>
              <strong>
                SHOP<span>FLOW</span>
              </strong>

              <small>
                Shop smarter. Live better.
              </small>
            </div>

          </Link>


          {/* HERO */}

          <div className="login-hero">

            <div className="hero-badge">
              <Sparkles size={13} />
              MODERN SHOPPING EXPERIENCE
            </div>

            <h1>
              Your next
              <br />

              <span>
                favorite thing
              </span>

              <br />

              is waiting.
            </h1>

            <p>
              Discover products you love,
              shop from trusted vendors and
              manage every order from one
              beautiful place.
            </p>

          </div>


          {/* FEATURES */}

          <div className="login-features">

            <div className="login-feature">

              <div className="feature-icon">
                <Sparkles size={16} />
              </div>

              <div>
                <strong>
                  Curated products
                </strong>

                <span>
                  Discover products worth
                  buying.
                </span>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                <Truck size={16} />
              </div>

              <div>
                <strong>
                  Easy tracking
                </strong>

                <span>
                  Track every order easily.
                </span>
              </div>

            </div>


            <div className="login-feature">

              <div className="feature-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>
                  Secure shopping
                </strong>

                <span>
                  Your account stays protected.
                </span>
              </div>

            </div>

          </div>


          {/* BRAND FOOTER */}

          <div className="brand-footer">

            <div className="avatar-stack">

              <span>SC</span>
              <span>AK</span>
              <span>RM</span>
              <span>+</span>

            </div>

            <div>
              <strong>
                Trusted by shoppers
              </strong>

              <small>
                Shop • Discover • Enjoy
              </small>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          RIGHT LOGIN SECTION
      ===================================== */}

      <section className="login-panel">

        <div className="login-container">

          {/* MOBILE LOGO */}

          <Link
            to="/"
            className="mobile-logo"
          >

            <div>
              <ShoppingBag size={18} />
            </div>

            <strong>
              SHOP<span>FLOW</span>
            </strong>

          </Link>


          {/* HEADER */}

          <div className="login-heading">

            <span className="login-kicker">
              WELCOME BACK
            </span>

            <h2>
              Sign in to ShopFlow
            </h2>

            <p>
              Continue your shopping
              journey.
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">

              <div className="error-icon">
                !
              </div>

              <div>
                <strong>
                  Login failed
                </strong>

                <span>
                  {error}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
              >
                ×
              </button>

            </div>
          )}


          {/* FORM */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <Mail
                  size={17}
                  className="input-icon"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <span>
                  Keep it secure
                </span>

              </div>

              <div className="input-wrapper">

                <LockKeyhole
                  size={17}
                  className="input-icon"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}

                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <label className="remember-row">

              <input type="checkbox" />

              <span>
                Keep me signed in
              </span>

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>


          {/* SECURITY */}

          <div className="security-box">

            <div className="security-icon">
              <ShieldCheck size={17} />
            </div>

            <div>

              <strong>
                Secure sign in
              </strong>

              <span>
                Your credentials are protected
                with secure authentication.
              </span>

            </div>

          </div>


          {/* REGISTER */}

          <div className="register-section">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create account
              <ArrowRight size={13} />
            </Link>

          </div>


          {/* FOOTER */}

          <div className="login-bottom">

            <span>
              © {new Date().getFullYear()} ShopFlow
            </span>

            <div>
              <span>Secure</span>
              <i>•</i>
              <span>Private</span>
              <i>•</i>
              <span>Reliable</span>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Login;