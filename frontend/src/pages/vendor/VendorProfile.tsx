import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  UserRound,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getVendorProfile,
  type VendorProfile as VendorProfileType
} from "../../services/vendorApi";

import "./VendorProfile.css";


const VendorProfile = () => {

  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<VendorProfileType | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ========================================
  // LOAD PROFILE
  // ========================================

  const loadProfile = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getVendorProfile();

      setProfile(data);

    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Failed to load vendor profile"
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // PAGE LOAD
  // ========================================

  useEffect(() => {

    loadProfile();

  }, []);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem("vendorToken");

    localStorage.removeItem("vendor");

    navigate("/vendor/login");

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="vendor-profile-page">

        <div className="vendor-profile-loading">

          <RefreshCw
            size={20}
            className="vendor-profile-spinner"
          />

          Loading profile...

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !profile) {

    return (

      <div className="vendor-profile-page">

        <div className="vendor-profile-error-card">

          <div className="vendor-profile-error-icon">
            !
          </div>

          <h2>
            Unable to load profile
          </h2>

          <p>
            {error || "Vendor profile not found"}
          </p>

          <div className="vendor-profile-error-actions">

            <button
              onClick={loadProfile}
              className="profile-retry-button"
            >
              Try Again
            </button>

            <button
              onClick={() =>
                navigate("/vendor/dashboard")
              }
              className="profile-back-button"
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="vendor-profile-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="vendor-profile-header">

        <button
          className="profile-back-link"
          onClick={() =>
            navigate("/vendor/dashboard")
          }
        >

          <ArrowLeft size={17} />

          Back to Dashboard

        </button>


        <div className="vendor-profile-heading">

          <p className="vendor-profile-eyebrow">
            VENDOR PORTAL
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            View your store and account information.
          </p>

        </div>

      </div>



      {/* ==================================
          PROFILE CARD
      ================================== */}

      <div className="vendor-profile-container">


        <div className="vendor-profile-main-card">


          {/* ==================================
              PROFILE HERO
          ================================== */}

          <div className="vendor-profile-hero">

            <div className="vendor-profile-avatar">

              {profile.businessName
                ?.charAt(0)
                ?.toUpperCase() || "V"}

            </div>


            <div className="vendor-profile-hero-info">

              <h2>
                {profile.businessName}
              </h2>

              <p>
                {profile.ownerName}
              </p>

            </div>


            <div className="vendor-profile-status">

              <span
                className={
                  profile.status === "APPROVED"
                    ? "profile-status approved"
                    : profile.status === "PENDING"
                    ? "profile-status pending"
                    : "profile-status rejected"
                }
              >

                <span className="status-dot"></span>

                {profile.status}

              </span>

            </div>

          </div>



          {/* ==================================
              ACCOUNT INFORMATION
          ================================== */}

          <div className="vendor-profile-section">

            <div className="profile-section-title">

              <ShieldCheck size={19} />

              <div>

                <h3>
                  Account Information
                </h3>

                <p>
                  Your registered vendor details.
                </p>

              </div>

            </div>


            <div className="vendor-profile-grid">


              {/* BUSINESS */}

              <div className="profile-info-item">

                <div className="profile-info-icon">

                  <Building2 size={18} />

                </div>

                <div>

                  <span>
                    Business Name
                  </span>

                  <strong>
                    {profile.businessName}
                  </strong>

                </div>

              </div>


              {/* OWNER */}

              <div className="profile-info-item">

                <div className="profile-info-icon">

                  <UserRound size={18} />

                </div>

                <div>

                  <span>
                    Owner Name
                  </span>

                  <strong>
                    {profile.ownerName}
                  </strong>

                </div>

              </div>


              {/* EMAIL */}

              <div className="profile-info-item">

                <div className="profile-info-icon">

                  <Mail size={18} />

                </div>

                <div>

                  <span>
                    Email Address
                  </span>

                  <strong>
                    {profile.email}
                  </strong>

                </div>

              </div>


              {/* PHONE */}

              <div className="profile-info-item">

                <div className="profile-info-icon">

                  <Phone size={18} />

                </div>

                <div>

                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {profile.phone}
                  </strong>

                </div>

              </div>


            </div>

          </div>



          {/* ==================================
              ACCOUNT STATUS
          ================================== */}

          <div className="vendor-account-status">

            <div className="account-status-icon">

              <ShieldCheck size={21} />

            </div>


            <div className="account-status-content">

              <strong>
                Vendor Account Status
              </strong>

              <p>

                {profile.status === "APPROVED"
                  ? "Your vendor account has been approved. You can manage your products and orders."
                  : profile.status === "PENDING"
                  ? "Your vendor account is waiting for administrator approval."
                  : "Your vendor account has been rejected. Please contact the administrator."}

              </p>

            </div>

          </div>



          {/* ==================================
              ACTIONS
          ================================== */}

          <div className="vendor-profile-actions">

            <button
              className="profile-refresh-button"
              onClick={loadProfile}
            >

              <RefreshCw size={16} />

              Refresh Profile

            </button>


            <button
              className="profile-logout-button"
              onClick={handleLogout}
            >

              Logout

            </button>

          </div>


        </div>

      </div>

    </div>

  );

};


export default VendorProfile;