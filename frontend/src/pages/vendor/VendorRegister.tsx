import { useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  UserRound,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Store,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./VendorRegister.css";

interface VendorRegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
}

const VendorRegister = () => {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !businessName.trim() ||
      !ownerName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password
    ) {
      setError("Please fill all the fields.");
      return;
    }

    if (phone.length !== 10) {
      setError("Phone number must contain 10 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post<VendorRegisterResponse>(
          "/vendors/register",
          {
            businessName: businessName.trim(),
            ownerName: ownerName.trim(),
            email: email.trim(),
            password,
            phone
          }
        );

      setSuccess(
        response.data.message ||
        "Vendor registered successfully."
      );

      setBusinessName("");
      setOwnerName("");
      setEmail("");
      setPhone("");
      setPassword("");

      setTimeout(() => {
        navigate("/vendor/login");
      }, 1800);

    } catch (error: any) {
      setError(
        error.response?.data?.message ||
        "Vendor registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-register-page">

      {/* LEFT SIDE */}

      <div className="vendor-register-left">

        <div className="vendor-register-brand">
          SHOP<span>FLOW</span>
        </div>

        <div className="vendor-register-content">

          <span className="vendor-register-eyebrow">
            SELL ON SHOPFLOW
          </span>

          <h1>
            Build your store.
            <br />
            Reach more customers.
          </h1>

          <p>
            Create your vendor account and start
            managing your products, inventory and
            orders from one place.
          </p>

          <div className="vendor-benefits">

            <div className="vendor-benefit">
              <div className="benefit-icon">
                <Store size={17} />
              </div>

              <div>
                <strong>
                  Manage your store
                </strong>

                <span>
                  Add and manage your products easily.
                </span>
              </div>
            </div>

            <div className="vendor-benefit">
              <div className="benefit-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>
                  Manage orders
                </strong>

                <span>
                  Track and update customer orders.
                </span>
              </div>
            </div>

            <div className="vendor-benefit">
              <div className="benefit-icon">
                <ArrowRight size={17} />
              </div>

              <div>
                <strong>
                  Grow your business
                </strong>

                <span>
                  Get your products in front of customers.
                </span>
              </div>
            </div>

          </div>

        </div>

        <div className="vendor-register-footer">
          © 2026 SHOPFLOW
        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="vendor-register-right">

        <div className="vendor-register-card">

          <div className="register-card-header">

            <div className="register-mobile-logo">
              SHOP<span>FLOW</span>
            </div>

            <span className="register-card-label">
              VENDOR ACCOUNT
            </span>

            <h2>
              Create your vendor account
            </h2>

            <p>
              Enter your business details to get started.
            </p>

          </div>


          <form
            className="vendor-register-form"
            onSubmit={handleSubmit}
          >

            {/* BUSINESS NAME */}

            <div className="vendor-register-field">

              <label>
                Business Name
              </label>

              <div className="register-input-wrapper">

                <Building2 size={17} />

                <input
                  type="text"
                  placeholder="e.g. TechNova Solutions"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                />

              </div>

            </div>


            {/* OWNER */}

            <div className="vendor-register-field">

              <label>
                Owner Name
              </label>

              <div className="register-input-wrapper">

                <UserRound size={17} />

                <input
                  type="text"
                  placeholder="Enter owner name"
                  value={ownerName}
                  onChange={(e) =>
                    setOwnerName(e.target.value)
                  }
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="vendor-register-field">

              <label>
                Email Address
              </label>

              <div className="register-input-wrapper">

                <Mail size={17} />

                <input
                  type="email"
                  placeholder="vendor@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="vendor-register-field">

              <label>
                Phone Number
              </label>

              <div className="register-input-wrapper">

                <Phone size={17} />

                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={phone}
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="vendor-register-field">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <Lock size={17} />

                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (

              <div className="vendor-register-message error">
                {error}
              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="vendor-register-message success">
                <CheckCircle2 size={16} />

                {success}
              </div>

            )}


            <button
              type="submit"
              className="vendor-register-button"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create Vendor Account"}

              {!loading && (
                <ArrowRight size={17} />
              )}

            </button>

          </form>


          <div className="vendor-register-login">

            Already have a vendor account?

            <Link to="/vendor/login">
              Sign in
            </Link>

          </div>


          <div className="vendor-register-note">

            Your account will remain
            <strong> PENDING </strong>
            until an admin approves your vendor account.

          </div>

        </div>

      </div>

    </div>
  );
};

export default VendorRegister;