import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Boxes
} from "lucide-react";

import {
  getVendorProducts,
  deleteVendorProduct
} from "../../services/vendorProductApi";

import type {
  VendorProduct
} from "../../services/vendorProductApi";

import "./VendorProducts.css";


const VendorProducts = () => {

  const navigate = useNavigate();

  const [products, setProducts] =
    useState<VendorProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getVendorProducts();

      setProducts(data);

    } catch (error: any) {

      console.error(
        "Vendor products error:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendor");

        navigate("/vendor/login");

        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load products"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    const token =
      localStorage.getItem("vendorToken");

    if (!token) {

      navigate("/vendor/login");

      return;

    }

    loadProducts();

  }, [navigate]);


  const handleDelete = async (
    productId: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteVendorProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product._id !== productId
        )
      );

    } catch (error: any) {

      alert(
        error.response?.data?.message ||
        "Unable to delete product"
      );

    }
  };


  if (loading) {

    return (
      <div className="vendor-products-state">

        <div className="vendor-products-loader"></div>

        <p>
          Loading your products...
        </p>

      </div>
    );

  }


  if (error) {

    return (
      <div className="vendor-products-state">

        <h2>
          Something went wrong
        </h2>

        <p>
          {error}
        </p>

        <button onClick={loadProducts}>
          Try Again
        </button>

      </div>
    );

  }


  return (

    <div className="vendor-products-page">

      {/* HEADER */}

      <div className="vendor-products-header">

        <div>

          <span>
            SHOPFLOW VENDOR
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage the products in your store.
          </p>

        </div>


        <button
          className="add-product-button"
          onClick={() =>
            navigate("/vendor/products/create")
          }
        >

          <Plus size={18} />

          Add Product

        </button>

      </div>


      {/* SUMMARY */}

      <div className="vendor-products-summary">

        <div>

          <Package size={20} />

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

          </div>

        </div>


        <div>

          <Boxes size={20} />

          <div>

            <span>
              Total Stock
            </span>

            <strong>
              {
                products.reduce(
                  (total, product) =>
                    total + product.stock,
                  0
                )
              }
            </strong>

          </div>

        </div>

      </div>


      {/* PRODUCTS */}

      {products.length === 0 ? (

        <div className="vendor-products-empty">

          <Package size={42} />

          <h2>
            No products yet
          </h2>

          <p>
            Start selling by adding your first product.
          </p>

          <button
            onClick={() =>
              navigate(
                "/vendor/products/create"
              )
            }
          >
            Add Your First Product
          </button>

        </div>

      ) : (

        <div className="vendor-products-table-wrapper">

          <table className="vendor-products-table">

            <thead>

              <tr>

                <th>Product</th>

                <th>Category</th>

                <th>Price</th>

                <th>Stock</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {products.map((product) => (

                <tr key={product._id}>

                  <td>

                    <div className="vendor-product-info">

                      <div className="vendor-product-image">

                        {product.image ? (

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                        ) : (

                          <Package size={22} />

                        )}

                      </div>


                      <div>

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          {product.description}
                        </span>

                      </div>

                    </div>

                  </td>


                  <td>
                    {product.category?.name ||
                      "Uncategorized"}
                  </td>


                  <td>
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>


                  <td>

                    <span
                      className={
                        product.stock <= 5
                          ? "low-stock"
                          : "normal-stock"
                      }
                    >
                      {product.stock}
                    </span>

                  </td>


                  <td>

                    <span
                      className={
                        product.isActive
                          ? "product-active"
                          : "product-inactive"
                      }
                    >
                      {product.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>


                  <td>

                    <div className="product-actions">

                      <button
                        className="edit-product"
                        onClick={() =>
                          navigate(
                            `/vendor/products/${product._id}/edit`
                          )
                        }
                      >

                        <Pencil size={16} />

                      </button>


                      <button
                        className="delete-product"
                        onClick={() =>
                          handleDelete(product._id)
                        }
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

  );
};


export default VendorProducts;