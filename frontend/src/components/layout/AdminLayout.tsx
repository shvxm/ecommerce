import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

import AdminSidebar from "./AdminSidebar";

import "../../pages/admin/AdminDashboard.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* Mobile menu */}

        <div className="admin-mobile-header">

          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <strong>
            Admin Panel
          </strong>

        </div>


        {/* Current admin page */}

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;