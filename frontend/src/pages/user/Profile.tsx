import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getProfile,
  updateProfile,
} from "../../services/userService";

import type {
  UserProfile,
} from "../../services/userService";

import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProfile();

      setProfile(data);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch (err: any) {
      console.error(
        "Profile loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError(
        "Name is required."
      );
      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        phone
      )
    ) {
      setError(
        "Enter a valid 10 digit phone number."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedUser =
        await updateProfile({
          name: name.trim(),
          phone: phone,
        });

      setProfile(updatedUser);

      setName(
        updatedUser.name
      );

      setPhone(
        updatedUser.phone || ""
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (err: any) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-error">
          {error ||
            "Unable to load profile."}
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-container">

        <Link
          to="/"
          className="profile-back"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="profile-header">

          <div className="profile-avatar">
            {profile.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <span className="profile-eyebrow">
              MY ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal
              information
            </p>
          </div>

        </div>

        {error && (
          <div className="profile-message error">
            {error}
          </div>
        )}

        {message && (
          <div className="profile-message success">
            ✓ {message}
          </div>
        )}

        <div className="profile-layout">

          {/* PROFILE FORM */}

          <section className="profile-card">

            <div className="card-heading">

              <div className="heading-icon">
                <User size={20} />
              </div>

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Update your account details
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="profile-form"
            >

              {/* NAME */}

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <div className="input-wrapper">

                  <User size={18} />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper disabled">

                  <Mail size={18} />

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                  />

                </div>

                <small>
                  Email address cannot be
                  changed.
                </small>

              </div>

              {/* PHONE */}

              <div className="profile-field">

                <label>
                  Phone Number
                </label>

                <div className="input-wrapper">

                  <Phone size={18} />

                  <input
                    type="tel"
                    value={phone}
                    maxLength={10}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 10)
                      )
                    }
                    placeholder="10 digit phone number"
                  />

                </div>

              </div>

              {/* ROLE */}

              <div className="profile-field">

                <label>
                  Account Type
                </label>

                <div className="account-role">
                  {profile.role}
                </div>

              </div>

              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </section>

          {/* ACCOUNT SUMMARY */}

          <aside className="account-summary">

            <h2>
              Account Overview
            </h2>

            <div className="summary-item">

              <span>
                Name
              </span>

              <strong>
                {profile.name}
              </strong>

            </div>

            <div className="summary-item">

              <span>
                Email
              </span>

              <strong>
                {profile.email}
              </strong>

            </div>

            <div className="summary-item">

              <span>
                Phone
              </span>

              <strong>
                {profile.phone ||
                  "Not added"}
              </strong>

            </div>

            <div className="summary-item">

              <span>
                Account
              </span>

              <strong>
                {profile.role}
              </strong>

            </div>

            <Link
              to="/addresses"
              className="addresses-link"
            >
              Manage Addresses
            </Link>

          </aside>

        </div>

      </div>

    </main>
  );
};

export default Profile;