import { useEffect, useState } from "react";
import {
  Power,
  RefreshCw,
  Store,
} from "lucide-react";

import {
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

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);


  // ========================================
  // GET ALL VENDORS
  // ========================================

  const loadVendors = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getAllVendors();

      setVendors(data);
    } catch (error: any) {
      console.error(
        "Failed to load vendors:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load vendors."
      );
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // LOAD VENDORS WHEN PAGE OPENS
  // ========================================

  useEffect(() => {
    loadVendors();
  }, []);


  // ========================================
  // ACTIVATE / DEACTIVATE VENDOR
  // ========================================

  const handleStatusChange = async (
    vendor: AdminVendor
  ) => {
    try {
      setUpdatingId(vendor._id);

      setError("");

      const updatedVendor =
        await updateVendorStatus(
          vendor._id,
          !vendor.isActive
        );


      setVendors((currentVendors) =>
        currentVendors.map((item) =>
          item._id === updatedVendor._id
            ? updatedVendor
            : item
        )
      );

    } catch (error: any) {
      console.error(
        "Failed to update vendor:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to update vendor status."
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div className="admin-vendors-page">

        <div className="admin-vendors-loading">

          <RefreshCw
            size={22}
            className="loading-icon"
          />

          <span>
            Loading vendors...
          </span>

        </div>

      </div>
    );
  }


  // ========================================
  // MAIN PAGE
  // ========================================

  return (
    <div className="admin-vendors-page">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="admin-vendors-header">

        <div>

          <div className="admin-vendors-label">
            ADMINISTRATION
          </div>

          <h1>
            Vendors
          </h1>

          <p>
            Manage vendor accounts,
            approval status and access.
          </p>

        </div>


        <button
          className="admin-vendors-refresh"
          onClick={loadVendors}
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {/* ================================== */}
      {/* ERROR */}
      {/* ================================== */}

      {error && (
        <div className="admin-vendors-error">
          {error}
        </div>
      )}


      {/* ================================== */}
      {/* STATISTICS */}
      {/* ================================== */}

      <div className="admin-vendor-stats">


        {/* TOTAL */}

        <div className="admin-vendor-stat-card">

          <span>
            Total Vendors
          </span>

          <strong>
            {vendors.length}
          </strong>

        </div>


        {/* ACTIVE */}

        <div className="admin-vendor-stat-card">

          <span>
            Active Vendors
          </span>

          <strong>
            {
              vendors.filter(
                (vendor) =>
                  vendor.isActive
              ).length
            }
          </strong>

        </div>


        {/* INACTIVE */}

        <div className="admin-vendor-stat-card">

          <span>
            Inactive Vendors
          </span>

          <strong>
            {
              vendors.filter(
                (vendor) =>
                  !vendor.isActive
              ).length
            }
          </strong>

        </div>


        {/* PENDING */}

        <div className="admin-vendor-stat-card">

          <span>
            Pending Approval
          </span>

          <strong>
            {
              vendors.filter(
                (vendor) =>
                  vendor.status ===
                  "PENDING"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* ================================== */}
      {/* VENDORS TABLE */}
      {/* ================================== */}

      <div className="admin-vendors-card">

        <div className="admin-vendors-table-wrapper">

          <table className="admin-vendors-table">

            <thead>

              <tr>

                <th>
                  Vendor
                </th>

                <th>
                  Owner
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Approval
                </th>

                <th>
                  Account
                </th>

                <th>
                  Action
                </th>

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

                    <span>
                      No vendors found.
                    </span>

                  </td>

                </tr>

              ) : (

                vendors.map(
                  (vendor) => (

                    <tr
                      key={vendor._id}
                    >


                      {/* ================= */}
                      {/* VENDOR */}
                      {/* ================= */}

                      <td>

                        <div className="admin-vendor-name">

                          <div className="admin-vendor-icon">

                            <Store size={18} />

                          </div>


                          <div>

                            <strong>
                              {
                                vendor.businessName
                              }
                            </strong>

                            <small>
                              {vendor.email}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* ================= */}
                      {/* OWNER */}
                      {/* ================= */}

                      <td>

                        {vendor.ownerName}

                      </td>


                      {/* ================= */}
                      {/* PHONE */}
                      {/* ================= */}

                      <td>

                        {vendor.phone}

                      </td>


                      {/* ================= */}
                      {/* APPROVAL */}
                      {/* ================= */}

                      <td>

                        <span
                          className={
                            `admin-approval-badge ${vendor.status.toLowerCase()}`
                          }
                        >

                          {vendor.status}

                        </span>

                      </td>


                      {/* ================= */}
                      {/* ACTIVE STATUS */}
                      {/* ================= */}

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


                      {/* ================= */}
                      {/* ACTION */}
                      {/* ================= */}

                      <td>

                        <button
                          className={
                            vendor.isActive
                              ? "admin-vendor-action deactivate"
                              : "admin-vendor-action activate"
                          }
                          disabled={
                            updatingId ===
                            vendor._id
                          }
                          onClick={() =>
                            handleStatusChange(
                              vendor
                            )
                          }
                        >

                          <Power size={15} />

                          {updatingId ===
                          vendor._id
                            ? "Updating..."
                            : vendor.isActive
                            ? "Deactivate"
                            : "Activate"}

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default AdminVendors;