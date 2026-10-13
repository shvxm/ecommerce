
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Power,
  RefreshCw,
  Store,
} from "lucide-react";

import {
  approveVendor,
  getAllVendors,
  updateVendorStatus,
} from "../../services/adminVendorApi";

import type {
  AdminVendor,
} from "../../services/adminVendorApi";

import "./AdminVendors.css";

const AdminVendors = () => {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load all vendors
  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllVendors();
      setVendors(data);
    } catch (error: any) {
      console.error("Failed to load vendors:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load vendors."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load vendors when the page opens
  useEffect(() => {
    loadVendors();
  }, []);

  // Approve a pending vendor
  const handleApproveVendor = async (
    vendor: AdminVendor
  ) => {
    try {
      setUpdatingId(vendor._id);
      setError("");
      setSuccess("");

      const updatedVendor = await approveVendor(vendor._id);

      setVendors((currentVendors) =>
        currentVendors.map((item) =>
          item._id === vendor._id
            ? {
                ...item,
                ...updatedVendor,
                _id: vendor._id,
              }
            : item
        )
      );

      setSuccess(
        `${vendor.businessName} has been approved successfully.`
      );
    } catch (error: any) {
      console.error("Failed to approve vendor:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to approve vendor."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Activate or deactivate a vendor
  const handleStatusChange = async (
    vendor: AdminVendor
  ) => {
    try {
      setUpdatingId(vendor._id);
      setError("");
      setSuccess("");

      const updatedVendor = await updateVendorStatus(
        vendor._id,
        !vendor.isActive
      );

      setVendors((currentVendors) =>
        currentVendors.map((item) =>
          item._id === vendor._id
            ? {
                ...item,
                ...updatedVendor,
                _id: vendor._id,
              }
            : item
        )
      );

      setSuccess(
        `${vendor.businessName} status updated successfully.`
      );
    } catch (error: any) {
      console.error("Failed to update vendor:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to update vendor status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="admin-vendors-page">
        <div className="admin-vendors-loading">
          <RefreshCw
            size={22}
            className="loading-icon"
          />
          <span>Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-vendors-page">
      {/* Header */}
      <div className="admin-vendors-header">
        <div>
          <div className="admin-vendors-label">
            ADMINISTRATION
          </div>

          <h1>Vendors</h1>

          <p>
            Manage vendor accounts, approval status and access.
          </p>
        </div>

        <button
          type="button"
          className="admin-vendors-refresh"
          onClick={loadVendors}
          disabled={updatingId !== null}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="admin-vendors-error" role="alert">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="admin-vendors-success"
          role="status"
        >
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="admin-vendor-stats">
        <div className="admin-vendor-stat-card">
          <span>Total Vendors</span>
          <strong>{vendors.length}</strong>
        </div>

        <div className="admin-vendor-stat-card">
          <span>Active Vendors</span>
          <strong>
            {vendors.filter((vendor) => vendor.isActive).length}
          </strong>
        </div>

        <div className="admin-vendor-stat-card">
          <span>Inactive Vendors</span>
          <strong>
            {vendors.filter((vendor) => !vendor.isActive).length}
          </strong>
        </div>

        <div className="admin-vendor-stat-card">
          <span>Pending Approval</span>
          <strong>
            {
              vendors.filter(
                (vendor) => vendor.status === "PENDING"
              ).length
            }
          </strong>
        </div>
      </div>

      {/* Vendors table */}
      <div className="admin-vendors-card">
        <div className="admin-vendors-table-wrapper">
          <table className="admin-vendors-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Owner</th>
                <th>Phone</th>
                <th>Approval</th>
                <th>Account</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="admin-vendors-empty"
                  >
                    <Store size={36} />
                    <span>No vendors found.</span>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    {/* Vendor details */}
                    <td>
                      <div className="admin-vendor-name">
                        <div className="admin-vendor-icon">
                          <Store size={18} />
                        </div>

                        <div>
                          <strong>
                            {vendor.businessName}
                          </strong>
                          <small>{vendor.email}</small>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td>{vendor.ownerName}</td>

                    {/* Phone */}
                    <td>{vendor.phone}</td>

                    {/* Approval status */}
                    <td>
                      <span
                        className={`admin-approval-badge ${
                          vendor.status.toLowerCase()
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>

                    {/* Account status */}
                    <td>
                      <span
                        className={
                          vendor.isActive
                            ? "admin-account-status active"
                            : "admin-account-status inactive"
                        }
                      >
                        <span className="admin-status-dot" />
                        {vendor.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="admin-vendor-actions">
                        {vendor.status === "PENDING" && (
                          <button
                            type="button"
                            className="admin-vendor-action activate"
                            disabled={updatingId !== null}
                            onClick={() =>
                              handleApproveVendor(vendor)
                            }
                          >
                            <CheckCircle size={15} />

                            {updatingId === vendor._id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        )}

                        {vendor.status !== "PENDING" && (
                          <button
                            type="button"
                            className={
                              vendor.isActive
                                ? "admin-vendor-action deactivate"
                                : "admin-vendor-action activate"
                            }
                            disabled={updatingId !== null}
                            onClick={() =>
                              handleStatusChange(vendor)
                            }
                          >
                            <Power size={15} />

                            {updatingId === vendor._id
                              ? "Updating..."
                              : vendor.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVendors;
