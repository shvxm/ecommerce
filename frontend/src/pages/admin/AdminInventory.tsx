import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Package,
  AlertTriangle,
  Save
} from "lucide-react";

import {
  getAdminInventory,
  getLowStockProducts,
  updateAdminInventory
} from "../../services/adminApi";

import type { AdminInventoryItem } from "../../services/adminApi";

import "./AdminInventory.css";

const AdminInventory = () => {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<
    Record<string, string>
  >({});
  const [error, setError] = useState("");

  const LOW_STOCK_LIMIT = 10;

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = showLowStock
        ? await getLowStockProducts(LOW_STOCK_LIMIT)
        : await getAdminInventory();

      setInventory(data);

      const values: Record<string, string> = {};

      data.forEach((item) => {
        values[item.id] = String(item.stock);
      });

      setStockValues(values);
    } catch (error) {
      console.error(error);
      setError("Unable to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [showLowStock]);

  const filteredInventory = useMemo(() => {
    const searchText = search.toLowerCase();

    return inventory.filter((item) => {
      const productName = item.name.toLowerCase();

      const categoryName =
        item.category?.name?.toLowerCase() || "";

      const vendorName =
        item.vendor?.businessName?.toLowerCase() || "";

      return (
        productName.includes(searchText) ||
        categoryName.includes(searchText) ||
        vendorName.includes(searchText)
      );
    });
  }, [inventory, search]);

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (total, item) => total + item.stock,
    0
  );

  const lowStockCount = inventory.filter(
    (item) => item.stock <= LOW_STOCK_LIMIT
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.stock === 0
  ).length;

  const handleStockChange = (
    productId: string,
    value: string
  ) => {
    setStockValues((previous) => ({
      ...previous,
      [productId]: value
    }));
  };

  const handleUpdateStock = async (
    productId: string
  ) => {
    const value = Number(stockValues[productId]);

    if (!Number.isInteger(value) || value < 0) {
      setError("Stock must be a valid number greater than or equal to 0");
      return;
    }

    try {
      setSavingId(productId);
      setError("");

      await updateAdminInventory(productId, value);

      await loadInventory();
    } catch (error) {
      console.error(error);
      setError("Unable to update inventory");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-inventory-page">

      <div className="admin-inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>
            Monitor and manage product stock
          </p>
        </div>

        <button
          className="inventory-refresh-button"
          onClick={loadInventory}
          disabled={loading}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="inventory-stats">

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
          </div>
        </div>

        <div className="inventory-stat-card warning">
          <div className="inventory-stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="inventory-stat-card danger">
          <div className="inventory-stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
          </div>
        </div>

      </div>

      <div className="inventory-toolbar">

        <div className="inventory-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search product, category or vendor..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <button
          className={
            showLowStock
              ? "inventory-filter active"
              : "inventory-filter"
          }
          onClick={() =>
            setShowLowStock(!showLowStock)
          }
        >
          <AlertTriangle size={17} />
          {showLowStock
            ? "Show All"
            : "Low Stock Only"}
        </button>

      </div>

      {error && (
        <div className="inventory-error">
          {error}
        </div>
      )}

      <div className="inventory-table-card">

        {loading ? (
          <div className="inventory-loading">
            Loading inventory...
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="inventory-empty">
            <Package size={42} />

            <h3>No inventory found</h3>

            <p>
              {search
                ? "Try a different search"
                : "There are no inventory items available"}
            </p>
          </div>
        ) : (
          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Current Stock</th>
                  <th>Update Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredInventory.map((item) => {

                  const stock = item.stock;

                  const isOutOfStock = stock === 0;

                  const isLowStock =
                    stock > 0 &&
                    stock <= LOW_STOCK_LIMIT;

                  return (
                    <tr key={item.id}>

                      <td>
                        <div className="inventory-product">
                          <div className="inventory-product-icon">
                            <Package size={18} />
                          </div>

                          <div>
                            <strong>
                              {item.name}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        {item.category?.name || "-"}
                      </td>

                      <td>
                        {item.vendor?.businessName ||
                          item.vendor?.ownerName ||
                          "-"}
                      </td>

                      <td>
                        <strong
                          className={
                            isOutOfStock
                              ? "stock-number out"
                              : isLowStock
                              ? "stock-number low"
                              : "stock-number"
                          }
                        >
                          {stock}
                        </strong>
                      </td>

                      <td>

                        <div className="inventory-update">

                          <input
                            type="number"
                            min="0"
                            value={
                              stockValues[item.id] ?? ""
                            }
                            onChange={(event) =>
                              handleStockChange(
                                item.id,
                                event.target.value
                              )
                            }
                          />

                          <button
                            onClick={() =>
                              handleUpdateStock(
                                item.id
                              )
                            }
                            disabled={
                              savingId === item.id
                            }
                            title="Update stock"
                          >
                            <Save size={16} />

                            {savingId === item.id
                              ? "Saving"
                              : "Save"}
                          </button>

                        </div>

                      </td>

                      <td>

                        {isOutOfStock ? (
                          <span className="inventory-status out">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inventory-status low">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inventory-status healthy">
                            In Stock
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default AdminInventory;