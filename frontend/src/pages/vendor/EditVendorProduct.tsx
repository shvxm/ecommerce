import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getVendorProducts,
  updateVendorProduct,
  type VendorProduct
} from "../../services/vendorProductApi";

import { getCategories } from "../../services/categoryApi";
import type { Category } from "../../services/categoryApi";

import "./EditVendorProduct.css";


const EditVendorProduct = () => {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();


  // ========================================
  // FORM STATES
  // ========================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");


  // ========================================
  // OTHER STATES
  // ========================================

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ========================================
  // LOAD PRODUCT + CATEGORIES
  // ========================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");


        // Get vendor products
        const products = await getVendorProducts();

        const product: VendorProduct | undefined =
          products.find((item) => item._id === id);


        if (!product) {

          setError("Product not found");

          return;
        }


        // Fill form with existing product data

        setName(product.name);

        setDescription(product.description);

        setPrice(String(product.price));

        setStock(String(product.stock));

        setCategory(product.category?._id || "");

        setImage(product.image || "");


        // Get categories

        const categoryData = await getCategories();

        setCategories(categoryData);

      } catch (error: any) {

        setError(
          error.response?.data?.message ||
          "Failed to load product"
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      loadData();

    }

  }, [id]);


  // ========================================
  // UPDATE PRODUCT
  // ========================================

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // Basic validation

    if (!name.trim()) {

      setError("Product name is required");

      return;
    }


    if (!description.trim()) {

      setError("Product description is required");

      return;
    }


    if (!price || Number(price) < 0) {

      setError("Please enter a valid price");

      return;
    }


    if (!stock || Number(stock) < 0) {

      setError("Please enter a valid stock quantity");

      return;
    }


    if (!category) {

      setError("Please select a category");

      return;
    }


    if (!id) {

      setError("Product ID is missing");

      return;
    }


    try {

      setSaving(true);


      await updateVendorProduct(id, {

        name: name.trim(),

        description: description.trim(),

        price: Number(price),

        stock: Number(stock),

        category,

        image: image.trim(),

      });


      setSuccess("Product updated successfully");


      // Redirect after short delay

      setTimeout(() => {

        navigate("/vendor/products");

      }, 800);


    } catch (error: any) {

      setError(
        error.response?.data?.message ||
        "Failed to update product"
      );

    } finally {

      setSaving(false);

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="edit-product-page">

        <div className="edit-product-loading">

          Loading product...

        </div>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="edit-product-page">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="edit-product-header">

        <button
          className="back-button"
          onClick={() => navigate("/vendor/products")}
        >

          <ArrowLeft size={18} />

          Back to Products

        </button>


        <div>

          <p className="page-eyebrow">
            VENDOR PORTAL
          </p>

          <h1>Edit Product</h1>

          <p>
            Update your product information and inventory.
          </p>

        </div>

      </div>



      {/* ================================== */}
      {/* FORM CARD */}
      {/* ================================== */}

      <div className="edit-product-card">


        <div className="edit-product-card-header">

          <div className="edit-product-icon">

            <Save size={20} />

          </div>

          <div>

            <h2>Product Information</h2>

            <p>
              Update the details of your product.
            </p>

          </div>

        </div>



        <form onSubmit={handleSubmit}>


          {/* ================================== */}
          {/* PRODUCT NAME */}
          {/* ================================== */}

          <div className="edit-form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>



          {/* ================================== */}
          {/* DESCRIPTION */}
          {/* ================================== */}

          <div className="edit-form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
            />

          </div>



          {/* ================================== */}
          {/* PRICE + STOCK */}
          {/* ================================== */}

          <div className="edit-form-row">


            <div className="edit-form-group">

              <label>
                Price (₹)
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />

            </div>



            <div className="edit-form-group">

              <label>
                Stock
              </label>

              <input
                type="number"
                min="0"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
              />

            </div>

          </div>



          {/* ================================== */}
          {/* CATEGORY */}
          {/* ================================== */}

          <div className="edit-form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                Select category
              </option>

              {categories.map((item) => (

                <option
                  key={item._id}
                  value={item._id}
                >

                  {item.name}

                </option>

              ))}

            </select>

          </div>



          {/* ================================== */}
          {/* IMAGE */}
          {/* ================================== */}

          <div className="edit-form-group">

            <label>
              Product Image URL
            </label>

            <input
              type="text"
              placeholder="/images/product.jpg"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
            />

            <span className="field-hint">
              Enter the path or URL of the product image.
            </span>

          </div>



          {/* ================================== */}
          {/* MESSAGES */}
          {/* ================================== */}

          {error && (

            <div className="edit-product-error">

              {error}

            </div>

          )}


          {success && (

            <div className="edit-product-success">

              {success}

            </div>

          )}



          {/* ================================== */}
          {/* ACTIONS */}
          {/* ================================== */}

          <div className="edit-product-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/vendor/products")
              }
            >

              Cancel

            </button>


            <button
              type="submit"
              className="update-button"
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Updating..."
                : "Update Product"}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

};


export default EditVendorProduct;