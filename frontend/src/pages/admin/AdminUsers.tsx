import {
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Search,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getAdminUsers,
  updateAdminUserStatus,
} from "../../services/adminApi";

import type { AdminUser } from "../../services/adminApi";

import "./AdminUsers.css";


const AdminUsers = () => {

  // ==============================
  // STATE
  // ==============================

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);


  // ==============================
  // LOAD USERS
  // ==============================

  const loadUsers = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getAdminUsers();

      setUsers(data);

    } catch (error: any) {

      console.error(
        "Failed to load users:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {

    loadUsers();

  }, []);


  // ==============================
  // SEARCH USERS
  // ==============================

  const filteredUsers =
    useMemo(() => {

      const searchText =
        search.trim().toLowerCase();

      if (!searchText) {
        return users;
      }

      return users.filter((user) => {

        return (
          user.name
            .toLowerCase()
            .includes(searchText) ||

          user.email
            .toLowerCase()
            .includes(searchText)
        );

      });

    }, [users, search]);


  // ==============================
  // USER STATUS
  // ==============================

  const handleStatusChange =
    async (
      user: AdminUser
    ) => {

      // Admin cannot be changed
      if (user.role === "ADMIN") {
        return;
      }

      try {

        setUpdatingId(user._id);

        const updatedUser =
          await updateAdminUserStatus(
            user._id,
            !user.isActive
          );

        setUsers((currentUsers) =>
          currentUsers.map((currentUser) =>
            currentUser._id === updatedUser._id
              ? updatedUser
              : currentUser
          )
        );

      } catch (error: any) {

        console.error(
          "Failed to update user:",
          error
        );

        alert(
          error?.response?.data?.message ||
          "Unable to update user status."
        );

      } finally {

        setUpdatingId(null);

      }
    };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="admin-users-layout">

        <main className="admin-users-main">

          <div className="admin-users-loading">

            <RefreshCw
              size={28}
              className="admin-users-loading-icon"
            />

            <p>
              Loading users...
            </p>

          </div>

        </main>

      </div>
    );
  }


  // ==============================
  // ERROR
  // ==============================

  if (error) {

    return (
      <div className="admin-users-layout">

        <main className="admin-users-main">

          <div className="admin-users-error">

            <UserX size={35} />

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={loadUsers}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );
  }


  // ==============================
  // COUNTS
  // ==============================

  const activeUsers =
    users.filter(
      (user) => user.isActive
    ).length;

  const inactiveUsers =
    users.filter(
      (user) => !user.isActive
    ).length;


  // ==============================
  // MAIN UI
  // ==============================

  return (

    <div className="admin-users-layout">

      <main className="admin-users-main">

        {/* HEADER */}

        <header className="admin-users-header">

          <div>

            <span className="admin-users-eyebrow">
              SHOPFLOW ADMIN
            </span>

            <h1>
              Users
            </h1>

            <p>
              Manage registered customers.
            </p>

          </div>

          <button
            className="admin-users-refresh"
            onClick={loadUsers}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </header>


        {/* STATS */}

        <section className="admin-users-stats">

          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <Users size={19} />
            </div>

            <div>

              <span>
                Total Users
              </span>

              <strong>
                {users.length}
              </strong>

            </div>

          </div>


          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <UserCheck size={19} />
            </div>

            <div>

              <span>
                Active Users
              </span>

              <strong>
                {activeUsers}
              </strong>

            </div>

          </div>


          <div className="admin-user-stat">

            <div className="admin-user-stat-icon">
              <UserX size={19} />
            </div>

            <div>

              <span>
                Inactive Users
              </span>

              <strong>
                {inactiveUsers}
              </strong>

            </div>

          </div>

        </section>


        {/* USERS PANEL */}

        <section className="admin-users-panel">

          <div className="admin-users-panel-header">

            <div>

              <span className="admin-users-panel-label">
                CUSTOMER ACCOUNTS
              </span>

              <h2>
                All Users
              </h2>

            </div>


            {/* SEARCH */}

            <div className="admin-users-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          {/* TABLE */}

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="admin-users-empty"
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  filteredUsers.map(
                    (user) => (

                      <tr key={user._id}>

                        {/* USER */}

                        <td>

                          <div className="admin-user-info">

                            <div className="admin-user-avatar">

                              {user.name
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <div>

                              <strong>
                                {user.name}
                              </strong>

                              <span>
                                {user.email}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* PHONE */}

                        <td>

                          {user.phone || "—"}

                        </td>


                        {/* ROLE */}

                        <td>

                          <span
                            className={`admin-user-role ${
                              user.role === "ADMIN"
                                ? "admin-role"
                                : "user-role"
                            }`}
                          >
                            {user.role}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`admin-user-status ${
                              user.isActive
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >

                            <span className="status-dot" />

                            {user.isActive
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>


                        {/* ACTION */}

                        <td>

                          {user.role === "ADMIN" ? (

                            <span className="admin-protected">
                              Protected
                            </span>

                          ) : (

                            <button
                              className={
                                user.isActive
                                  ? "user-action deactivate"
                                  : "user-action activate"
                              }

                              disabled={
                                updatingId ===
                                user._id
                              }

                              onClick={() =>
                                handleStatusChange(
                                  user
                                )
                              }
                            >

                              {updatingId ===
                              user._id
                                ? "Updating..."
                                : user.isActive
                                ? "Deactivate"
                                : "Activate"}

                            </button>

                          )}

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

  );
};

export default AdminUsers;