import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  X
} from "lucide-react";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from "../../services/adminApi";

import type { AdminCategory } from "../../services/adminApi";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AdminCategory | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchText = search.toLowerCase();

      return (
        category.name.toLowerCase().includes(searchText) ||
        category.description?.toLowerCase().includes(searchText)
      );
    });
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: ""
    });

    setShowModal(true);
  };

  const openEditModal = (category: AdminCategory) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description || ""
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: ""
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (name.length < 2) {
      setError("Category name must be at least 2 characters");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, {
          name,
          description
        });
      } else {
        await createAdminCategory({
          name,
          description
        });
      }

      closeModal();

      await loadCategories();
    } catch (error) {
      console.error(error);
      setError(
        editingCategory
          ? "Unable to update category"
          : "Unable to create category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (category: AdminCategory) => {
    try {
      setError("");

      await updateAdminCategory(category._id, {
        isActive: !category.isActive
      });

      await loadCategories();
    } catch (error) {
      console.error(error);
      setError("Unable to update category status");
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteAdminCategory(category._id);

      await loadCategories();
    } catch (error) {
      console.error(error);
      setError("Unable to delete category");
    }
  };

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories =
    totalCategories - activeCategories;

  return (
    <div className="admin-categories-page">

      <div className="admin-categories-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories</p>
        </div>

        <button
          className="category-add-button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="category-stats">

        <div className="category-stat-card">
          <span>Total Categories</span>
          <strong>{totalCategories}</strong>
        </div>

        <div className="category-stat-card">
          <span>Active</span>
          <strong>{activeCategories}</strong>
        </div>

        <div className="category-stat-card">
          <span>Inactive</span>
          <strong>{inactiveCategories}</strong>
        </div>

      </div>

      <div className="category-toolbar">

        <div className="category-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <button
          className="category-refresh-button"
          onClick={loadCategories}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="category-error">
          {error}
        </div>
      )}

      <div className="category-table-card">

        {loading ? (
          <div className="category-loading">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="category-empty">
            <h3>No categories found</h3>

            <p>
              {search
                ? "Try a different search"
                : "Create your first category"}
            </p>
          </div>
        ) : (
          <div className="category-table-wrapper">

            <table className="category-table">

              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCategories.map((category) => (

                  <tr key={category._id}>

                    <td>
                      <div className="category-name">
                        {category.name}
                      </div>
                    </td>

                    <td>
                      <div className="category-description">
                        {category.description || "No description"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          category.isActive
                            ? "category-status active"
                            : "category-status inactive"
                        }
                      >
                        {category.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {category.createdAt
                        ? new Date(
                            category.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>

                      <div className="category-actions">

                        <button
                          className="category-action edit"
                          onClick={() =>
                            openEditModal(category)
                          }
                          title="Edit category"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="category-action status"
                          onClick={() =>
                            handleToggleStatus(category)
                          }
                          title={
                            category.isActive
                              ? "Deactivate category"
                              : "Activate category"
                          }
                        >
                          {category.isActive ? (
                            <PowerOff size={16} />
                          ) : (
                            <Power size={16} />
                          )}
                        </button>

                        <button
                          className="category-action delete"
                          onClick={() =>
                            handleDelete(category)
                          }
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {showModal && (
        <div
          className="category-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="category-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="category-modal-header">

              <div>
                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update category details"
                    : "Create a new product category"}
                </p>
              </div>

              <button
                className="category-modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="category-form-group">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value
                    })
                  }
                />

              </div>

              <div className="category-form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Enter category description"
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description:
                        event.target.value
                    })
                  }
                />

              </div>

              <div className="category-modal-actions">

                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminCategories;