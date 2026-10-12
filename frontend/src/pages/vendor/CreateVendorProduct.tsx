import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  createVendorProduct
} from "../../services/vendorProductApi";

import {
  getCategories
} from "../../services/categoryApi";

import type {
  Category
} from "../../services/categoryApi";

import "./CreateVendorProduct.css";


const CreateVendorProduct = () => {

  const navigate = useNavigate();


  // ========================================
  // FORM STATE
  // ========================================

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [image, setImage] =
    useState("");


  // ========================================
  // PAGE STATE
  // ========================================

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ========================================
  // LOAD CATEGORIES
  // ========================================

  useEffect(() => {

    const loadCategories =
      async () => {

        try {

          setLoadingCategories(true);

          const data =
            await getCategories();

          setCategories(data);

        } catch (error: any) {

          setError(
            error.response?.data?.message ||
            "Unable to load categories"
          );

        } finally {

          setLoadingCategories(false);

        }

      };


    loadCategories();

  }, []);


  // ========================================
  // SUBMIT FORM
  // ========================================

  const handleSubmit =
    async (
      e: FormEvent
    ) => {

      e.preventDefault();

      setError("");
      setSuccess("");


      // ========================================
      // BASIC VALIDATION
      // ========================================

      if (!name.trim()) {

        setError(
          "Product name is required"
        );

        return;

      }


      if (!description.trim()) {

        setError(
          "Product description is required"
        );

        return;

      }


      if (!price) {

        setError(
          "Product price is required"
        );

        return;

      }


      if (
        Number(price) < 0
      ) {

        setError(
          "Price cannot be negative"
        );

        return;

      }


      if (!stock) {

        setError(
          "Product stock is required"
        );

        return;

      }


      if (
        Number(stock) < 0
      ) {

        setError(
          "Stock cannot be negative"
        );

        return;

      }


      if (!category) {

        setError(
          "Please select a category"
        );

        return;

      }


      // ========================================
      // API REQUEST
      // ========================================

      try {

        setLoading(true);


        await createVendorProduct({

          name: name.trim(),

          description:
            description.trim(),

          price:
            Number(price),

          stock:
            Number(stock),

          category,

          image:
            image.trim()

        });


        setSuccess(
          "Product created successfully!"
        );


        // Clear form

        setName("");

        setDescription("");

        setPrice("");

        setStock("");

        setCategory("");

        setImage("");


        // Redirect after short delay

        setTimeout(() => {

          navigate(
            "/vendor/products"
          );

        }, 800);


      } catch (error: any) {

        setError(
          error.response?.data?.message ||
          "Unable to create product"
        );

      } finally {

        setLoading(false);

      }

    };


  // ========================================
  // JSX
  // ========================================

  return (

    <div className="create-product-page">

      <div className="create-product-container">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="create-product-header">

          <button
            className="back-button"
            onClick={() =>
              navigate(
                "/vendor/products"
              )
            }
          >

            <ArrowLeft size={18} />

            Back to Products

          </button>


          <div className="create-product-title">

            <div className="create-product-icon">

              <PackagePlus
                size={24}
              />

            </div>


            <div>

              <h1>
                Add New Product
              </h1>

              <p>
                Add a new product to your
                store inventory.
              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* FORM CARD */}
        {/* ================================= */}

        <div className="create-product-card">

          <form
            onSubmit={handleSubmit}
          >


            {/* ============================= */}
            {/* PRODUCT NAME */}
            {/* ============================= */}

            <div className="form-section">

              <h2>
                Product Information
              </h2>

              <p className="section-description">
                Enter the basic information
                about your product.
              </p>


              <div className="form-group">

                <label>
                  Product Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. iPhone 16 Pro"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                  <span>*</span>
                </label>

                <textarea
                  placeholder="Describe your product..."
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                />

              </div>


              {/* PRICE + STOCK */}

              <div className="form-row">


                <div className="form-group">

                  <label>
                    Price
                    <span>*</span>
                  </label>

                  <div className="input-with-symbol">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Stock
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={stock}
                    onChange={(e) =>
                      setStock(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                  <span>*</span>
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingCategories
                  }
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>


                  {categories.map(
                    (item) => (

                      <option
                        key={item._id}
                        value={item._id}
                      >

                        {item.name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* IMAGE */}

              <div className="form-group">

                <label>
                  Product Image URL
                </label>

                <input
                  type="text"
                  placeholder="https://example.com/product.jpg"
                  value={image}
                  onChange={(e) =>
                    setImage(
                      e.target.value
                    )
                  }
                />

                <small>
                  Add a public image URL for
                  your product.
                </small>

              </div>

            </div>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (

              <div className="form-message error">

                {error}

              </div>

            )}


            {/* ================================= */}
            {/* SUCCESS */}
            {/* ================================= */}

            {success && (

              <div className="form-message success">

                {success}

              </div>

            )}


            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate(
                    "/vendor/products"
                  )
                }
              >

                Cancel

              </button>


              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >

                {loading
                  ? "Creating Product..."
                  : "Create Product"}

              </button>

            </div>


          </form>

        </div>

      </div>

    </div>

  );

};


export default CreateVendorProduct;