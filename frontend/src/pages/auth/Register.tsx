import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "../../services/api";
import "./Register.css";

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      role: string;
      status: string;
    };
    token: string;
  };
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please enter your address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<RegisterResponse>(
        "/auth/register",
        formData
      );

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;

        localStorage.setItem("token", token);

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setSuccess(
          "Account created successfully!"
        );

        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setError(
          response.data.message ||
            "Registration failed."
        );
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message;

      setError(
        backendMessage ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      {/* LEFT SIDE */}
      <section className="register-showcase">

        <div className="register-showcase-content">

          <span className="register-eyebrow">
            WELCOME TO SHOPFLOW
          </span>

          <h1>
            Your shopping
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Create your account and discover
            products selected for your everyday life.
          </p>

          <div className="register-features">

            <div>
              <strong>01</strong>
              <span>Curated products</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Simple shopping</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Secure checkout</span>
            </div>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="register-form-section">

        <div className="register-form-container">

          <div className="register-heading">

            <span>Create account</span>

            <h2>
              Join ShopFlow.
            </h2>

            <p>
              Create your account to start shopping.
            </p>

          </div>


          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}
            <div className="register-field">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />

            </div>


            {/* EMAIL */}
            <div className="register-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

            </div>


            {/* PHONE */}
            <div className="register-field">

              <label htmlFor="phone">
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

            </div>


            {/* ADDRESS */}
            <div className="register-field">

              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="street-address"
              />

            </div>


            {/* PASSWORD */}
            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
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

              <small>
                Minimum 6 characters
              </small>

            </div>


            {/* ERROR */}
            {error && (
              <div className="register-message error">
                {error}
              </div>
            )}


            {/* SUCCESS */}
            {success && (
              <div className="register-message success">
                {success}
              </div>
            )}


            {/* SUBMIT */}
            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Register;