import {
  Package,
  Search,
  RefreshCw,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAdminProducts,
  deleteAdminProduct,
  updateAdminProductStatus,
} from "../../services/adminApi";

import type {
  AdminProduct,
} from "../../services/adminApi";

import "./AdminProducts.css";


const AdminProducts = () => {

  // ========================================
  // STATE
  // ========================================

  const [products, setProducts] =
    useState<AdminProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);


  // ========================================
  // LOAD PRODUCTS
  // ========================================

  const loadProducts = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getAdminProducts();

      setProducts(data);

    } catch (error: any) {

      console.error(
        "Failed to load products:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {

    loadProducts();

  }, []);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts =
    useMemo(() => {

      const searchText =
        search
          .trim()
          .toLowerCase();

      return products.filter((product) => {

        const matchesSearch =
          !searchText ||
          product.name
            .toLowerCase()
            .includes(searchText) ||
          product.vendor?.businessName
            ?.toLowerCase()
            .includes(searchText) ||
          product.category?.name
            ?.toLowerCase()
            .includes(searchText);

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" &&
            product.isActive) ||
          (statusFilter === "INACTIVE" &&
            !product.isActive);

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [
      products,
      search,
      statusFilter
    ]);


  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDelete =
    async (product: AdminProduct) => {

      const confirmed =
        window.confirm(
          `Delete "${product.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setUpdatingId(
          product._id
        );

        await deleteAdminProduct(
          product._id
        );

        setProducts((current) =>
          current.filter(
            (item) =>
              item._id !== product._id
          )
        );

      } catch (error: any) {

        console.error(
          "Failed to delete product:",
          error
        );

        alert(
          error?.response?.data?.message ||
          "Unable to delete product."
        );

      } finally {

        setUpdatingId(null);

      }

    };


  // ========================================
  // TOGGLE STATUS
  // ========================================

  const handleToggleStatus =
    async (product: AdminProduct) => {

      try {

        setUpdatingId(
          product._id
        );

        const updatedProduct =
          await updateAdminProductStatus(
            product._id,
            !product.isActive
          );

        setProducts((current) =>
          current.map((item) =>
            item._id === product._id
              ? updatedProduct
              : item
          )
        );

      } catch (error: any) {

        console.error(
          "Failed to update product status:",
          error
        );

        alert(
          error?.response?.data?.message ||
          "Unable to update product status."
        );

      } finally {

        setUpdatingId(null);

      }

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <div className="admin-products-page">

        <div className="admin-products-loading">

          <RefreshCw
            size={30}
            className="admin-products-spinner"
          />

          <p>
            Loading products...
          </p>

        </div>

      </div>
    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (
      <div className="admin-products-page">

        <div className="admin-products-error">

          <Package size={40} />

          <h2>
            Unable to load products
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadProducts}
            className="admin-products-retry"
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="admin-products-page">

      {/* HEADER */}

      <div className="admin-products-header">

        <div>

          <p className="admin-products-eyebrow">
            ADMIN PANEL
          </p>

          <h1>
            Products
          </h1>

          <p>
            Manage products across the marketplace.
          </p>

        </div>

        <button
          className="admin-products-refresh"
          onClick={loadProducts}
        >
          <RefreshCw size={17} />

          Refresh

        </button>

      </div>


      {/* STATS */}

      <div className="admin-products-stats">

        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            <Package size={20} />
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

          </div>

        </div>


        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            <Power size={20} />
          </div>

          <div>

            <span>
              Active
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.isActive
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            <PowerOff size={20} />
          </div>

          <div>

            <span>
              Inactive
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    !product.isActive
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="admin-product-stat">

          <div className="admin-product-stat-icon">
            <Package size={20} />
          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.stock <= 10
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* FILTER BAR */}

      <div className="admin-products-toolbar">

        <div className="admin-products-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by product, vendor or category..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | "ACTIVE"
                | "INACTIVE"
            )
          }
          className="admin-products-filter"
        >

          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

        </select>

      </div>


      {/* TABLE */}

      <div className="admin-products-table-wrapper">

        <table className="admin-products-table">

          <thead>

            <tr>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Vendor
              </th>

              <th>
                Price
              </th>

              <th>
                Stock
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="admin-products-empty"
                >

                  <Package size={35} />

                  <span>
                    No products found.
                  </span>

                </td>

              </tr>

            ) : (

              filteredProducts.map(
                (product) => (

                  <tr
                    key={product._id}
                  >

                    {/* PRODUCT */}

                    <td>

                      <div className="admin-product-info">

                        {product.image ? (

                          <img
                            src={
                              product.image.startsWith("/")
                                ? product.image
                                : `/images/${product.image}`
                            }
                            alt={product.name}
                            className="admin-product-image"
                          />

                        ) : (

                          <div className="admin-product-placeholder">

                            <Package size={20} />

                          </div>

                        )}

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            ID: {product._id.slice(-8)}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      {product.category?.name ||
                        "—"}

                    </td>


                    {/* VENDOR */}

                    <td>

                      <div className="admin-product-vendor">

                        <strong>
                          {
                            product.vendor
                              ?.businessName ||
                            "—"
                          }
                        </strong>

                        <span>
                          {
                            product.vendor
                              ?.ownerName ||
                            ""
                          }
                        </span>

                      </div>

                    </td>


                    {/* PRICE */}

                    <td>

                      <strong>
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </td>


                    {/* STOCK */}

                    <td>

                      <span
                        className={
                          product.stock <= 10
                            ? "stock-low"
                            : "stock-normal"
                        }
                      >
                        {product.stock}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          product.isActive
                            ? "product-status-active"
                            : "product-status-inactive"
                        }
                      >

                        {product.isActive
                          ? "Active"
                          : "Inactive"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="admin-product-actions">

                        <button
                          className={
                            product.isActive
                              ? "product-action-disable"
                              : "product-action-enable"
                          }
                          onClick={() =>
                            handleToggleStatus(
                              product
                            )
                          }
                          disabled={
                            updatingId ===
                            product._id
                          }
                          title={
                            product.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                        >

                          {product.isActive ? (
                            <PowerOff size={16} />
                          ) : (
                            <Power size={16} />
                          )}

                        </button>


                        <button
                          className="product-action-delete"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                          disabled={
                            updatingId ===
                            product._id
                          }
                          title="Delete"
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* RESULT COUNT */}

      <div className="admin-products-result-count">

        Showing{" "}
        <strong>
          {filteredProducts.length}
        </strong>{" "}
        of{" "}
        <strong>
          {products.length}
        </strong>{" "}
        products

      </div>

    </div>

  );

};


export default AdminProducts;