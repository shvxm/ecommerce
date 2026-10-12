import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  PackageOpen,
  Heart,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProducts,
  type Product,
} from "../../services/productApi";

import {
  getCategories,
  type Category,
} from "../../services/categoryApi";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import "./Products.css";

const Products = () => {
  // =====================================================
  // URL SEARCH PARAMETERS
  // =====================================================

  const [searchParams, setSearchParams] =
    useSearchParams();

  // =====================================================
  // STATES
  // =====================================================

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") || ""
    );

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  const [minPrice, setMinPrice] =
    useState(
      searchParams.get("minPrice") || ""
    );

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get("maxPrice") || ""
    );

  const [inStock, setInStock] =
    useState(
      searchParams.get("inStock") === "true"
    );

  const [sort, setSort] =
    useState(
      searchParams.get("sort") || "newest"
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  // =====================================================
  // WISHLIST STATES
  // =====================================================

  const [wishlistIds, setWishlistIds] =
    useState<string[]>([]);

  const [wishlistLoading, setWishlistLoading] =
    useState<string | null>(null);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data =
          await getCategories();

        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  useEffect(() => {
    const loadWishlist = async () => {
      const token =
        localStorage.getItem("token");

      // User is not logged in
      if (!token) {
        setWishlistIds([]);
        return;
      }

      try {
        const response =
          await getWishlist();

        const wishlistProducts =
          response?.data?.products || [];

        const ids =
          wishlistProducts.map(
            (product: Product) =>
              product._id
          );

        setWishlistIds(ids);
      } catch (error) {
        console.error(
          "Failed to fetch wishlist:",
          error
        );

        setWishlistIds([]);
      }
    };

    loadWishlist();
  }, []);

  // =====================================================
  // SYNC CATEGORY FROM URL
  // =====================================================

  useEffect(() => {
    const categoryFromUrl =
      searchParams.get("category") || "";

    setSelectedCategory(
      categoryFromUrl
    );

    setSelectedSubcategory("");
  }, [searchParams]);

  // =====================================================
  // PARENT CATEGORIES
  // =====================================================

  const parentCategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          !category.parentCategory
      );
    }, [categories]);

  // =====================================================
  // SUBCATEGORIES
  // =====================================================

  const subcategories =
    useMemo(() => {
      if (!selectedCategory) {
        return [];
      }

      return categories.filter(
        (category) =>
          category.parentCategory ===
          selectedCategory
      );
    }, [
      categories,
      selectedCategory,
    ]);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params: Record<
          string,
          string
        > = {};

        // SEARCH

        if (search.trim()) {
          params.search =
            search.trim();
        }

        // CATEGORY

        const categoryToSend =
          selectedSubcategory ||
          selectedCategory;

        if (categoryToSend) {
          params.category =
            categoryToSend;
        }

        // MIN PRICE

        if (minPrice) {
          params.minPrice =
            minPrice;
        }

        // MAX PRICE

        if (maxPrice) {
          params.maxPrice =
            maxPrice;
        }

        // IN STOCK

        if (inStock) {
          params.inStock = "true";
        }

        // SORT

        if (sort) {
          params.sort = sort;
        }

        // API CALL

        const data =
          await getProducts(params);

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    search,
    selectedCategory,
    selectedSubcategory,
    minPrice,
    maxPrice,
    inStock,
    sort,
  ]);

  // =====================================================
  // UPDATE URL
  // =====================================================

  const updateUrl = (
    updates: Record<string, string>
  ) => {
    const params: Record<
      string,
      string
    > = {};

    // SEARCH

    if (
      updates.search !== undefined
    ) {
      if (updates.search) {
        params.search =
          updates.search;
      }
    } else {
      const existingSearch =
        searchParams.get("search");

      if (existingSearch) {
        params.search =
          existingSearch;
      }
    }

    // CATEGORY

    if (
      updates.category !== undefined
    ) {
      if (updates.category) {
        params.category =
          updates.category;
      }
    } else {
      const existingCategory =
        searchParams.get("category");

      if (existingCategory) {
        params.category =
          existingCategory;
      }
    }

    // MIN PRICE

    if (
      updates.minPrice !== undefined
    ) {
      if (updates.minPrice) {
        params.minPrice =
          updates.minPrice;
      }
    } else {
      const existingMin =
        searchParams.get("minPrice");

      if (existingMin) {
        params.minPrice =
          existingMin;
      }
    }

    // MAX PRICE

    if (
      updates.maxPrice !== undefined
    ) {
      if (updates.maxPrice) {
        params.maxPrice =
          updates.maxPrice;
      }
    } else {
      const existingMax =
        searchParams.get("maxPrice");

      if (existingMax) {
        params.maxPrice =
          existingMax;
      }
    }

    // STOCK

    if (
      updates.inStock !== undefined
    ) {
      if (
        updates.inStock === "true"
      ) {
        params.inStock = "true";
      }
    } else {
      const existingStock =
        searchParams.get("inStock");

      if (
        existingStock === "true"
      ) {
        params.inStock = "true";
      }
    }

    // SORT

    if (
      updates.sort !== undefined
    ) {
      if (
        updates.sort &&
        updates.sort !== "newest"
      ) {
        params.sort =
          updates.sort;
      }
    } else {
      const existingSort =
        searchParams.get("sort");

      if (
        existingSort &&
        existingSort !== "newest"
      ) {
        params.sort =
          existingSort;
      }
    }

    setSearchParams(params);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    updateUrl({
      search,
    });
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value;

    setSelectedCategory(value);

    setSelectedSubcategory("");

    if (value) {
      setSearchParams({
        category: value,
      });
    } else {
      setSearchParams({});
    }
  };

  // =====================================================
  // SUBCATEGORY CHANGE
  // =====================================================

  const handleSubcategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value;

    setSelectedSubcategory(value);

    if (value) {
      setSearchParams({
        category: value,
      });
    } else if (selectedCategory) {
      setSearchParams({
        category:
          selectedCategory,
      });
    } else {
      setSearchParams({});
    }
  };

  // =====================================================
  // SORT CHANGE
  // =====================================================

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value =
      event.target.value;

    setSort(value);

    updateUrl({
      sort: value,
    });
  };

  // =====================================================
  // WISHLIST TOGGLE
  // =====================================================

  const handleWishlistToggle = async (
    event: React.MouseEvent,
    productId: string
  ) => {
    /*
      Product card is a Link.

      So if we don't stop the click,
      clicking the heart will also open
      the product details page.
    */

    event.preventDefault();
    event.stopPropagation();

    const token =
      localStorage.getItem("token");

    // User must login first

    if (!token) {
      window.location.href =
        "/login";

      return;
    }

    try {
      setWishlistLoading(
        productId
      );

      const isAlreadyInWishlist =
        wishlistIds.includes(
          productId
        );

      // REMOVE FROM WISHLIST

      if (isAlreadyInWishlist) {
        await removeFromWishlist(
          productId
        );

        setWishlistIds(
          (previous) =>
            previous.filter(
              (id) =>
                id !== productId
            )
        );
      }

      // ADD TO WISHLIST

      else {
        await addToWishlist(
          productId
        );

        setWishlistIds(
          (previous) => [
            ...previous,
            productId,
          ]
        );
      }
    } catch (error: any) {
      console.error(
        "Wishlist update failed:",
        error
      );

      alert(
        error?.response?.data
          ?.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(null);
    }
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");

    setSelectedCategory("");

    setSelectedSubcategory("");

    setMinPrice("");

    setMaxPrice("");

    setInStock(false);

    setSort("newest");

    setSearchParams({});
  };

  // =====================================================
  // PRODUCT COUNT TEXT
  // =====================================================

  const productCountText =
    loading
      ? "Loading products..."
      : `${products.length} ${
          products.length === 1
            ? "product"
            : "products"
        }`;

  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  const selectedCategoryName =
    categories.find(
      (category) =>
        category._id ===
        selectedCategory
    )?.name;

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="products-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section className="products-header">

        <div>

          <span className="products-eyebrow">
            SHOPFLOW COLLECTION
          </span>

          <h1>
            {selectedCategoryName ||
              "All Products"}
          </h1>

          <p>
            Discover products selected
            for everyday living.
          </p>

        </div>

      </section>


      {/* =========================================
          SEARCH
      ========================================= */}

      <section className="products-toolbar">

        <form
          className="product-search"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => {
                setSearch("");

                updateUrl({
                  search: "",
                });
              }}
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="search-submit"
          >
            Search
          </button>

        </form>


        {/* MOBILE FILTER BUTTON */}

        <button
          className="mobile-filter-button"
          onClick={() =>
            setFiltersOpen(
              !filtersOpen
            )
          }
        >
          <SlidersHorizontal
            size={17}
          />

          Filters
        </button>


        {/* SORT */}

        <select
          className="sort-select"
          value={sort}
          onChange={
            handleSortChange
          }
        >

          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="oldest">
            Oldest
          </option>

        </select>

      </section>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="products-layout">

        {/* =======================================
            FILTER SIDEBAR
        ======================================= */}

        <aside
          className={
            filtersOpen
              ? "products-filters filters-open"
              : "products-filters"
          }
        >

          <div className="filter-heading">

            <div>

              <span>
                FILTERS
              </span>

              <h3>
                Refine
              </h3>

            </div>

            <button
              className="mobile-close-filter"
              onClick={() =>
                setFiltersOpen(false)
              }
            >
              <X size={20} />
            </button>

          </div>


          {/* CATEGORY */}

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              className="category-select"
              value={selectedCategory}
              onChange={
                handleCategoryChange
              }
            >

              <option value="">
                All Categories
              </option>

              {parentCategories.map(
                (category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* SUBCATEGORY */}

          {subcategories.length > 0 && (
            <div className="filter-group">

              <label>
                Subcategory
              </label>

              <select
                className="category-select"
                value={
                  selectedSubcategory
                }
                onChange={
                  handleSubcategoryChange
                }
              >

                <option value="">
                  All Subcategories
                </option>

                {subcategories.map(
                  (category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>
          )}


          {/* PRICE */}

          <div className="filter-group">

            <label>
              Price range
            </label>

            <div className="price-inputs">

              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setMinPrice(value);

                  updateUrl({
                    minPrice: value,
                  });
                }}
              />

              <span>
                —
              </span>

              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setMaxPrice(value);

                  updateUrl({
                    maxPrice: value,
                  });
                }}
              />

            </div>

          </div>


          {/* STOCK */}

          <div className="filter-group">

            <label className="stock-checkbox">

              <input
                type="checkbox"
                checked={inStock}
                onChange={(event) => {
                  const checked =
                    event.target.checked;

                  setInStock(checked);

                  updateUrl({
                    inStock: checked
                      ? "true"
                      : "",
                  });
                }}
              />

              <span>
                Only show in-stock
              </span>

            </label>

          </div>


          {/* CLEAR */}

          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear all filters
          </button>

        </aside>


        {/* =======================================
            PRODUCT AREA
        ======================================= */}

        <div className="products-content">

          <div className="products-result-bar">

            <span>
              {productCountText}
            </span>

            {selectedCategoryName && (
              <span className="active-filter">

                {selectedCategoryName}

                <button
                  onClick={() =>
                    clearFilters()
                  }
                >
                  <X size={13} />
                </button>

              </span>
            )}

          </div>


          {/* =====================================
              LOADING
          ===================================== */}

          {loading && (
            <div className="products-loading">

              <div className="loading-spinner">
              </div>

              <p>
                Loading products...
              </p>

            </div>
          )}


          {/* =====================================
              ERROR
          ===================================== */}

          {!loading && error && (
            <div className="products-error">

              <PackageOpen
                size={42}
              />

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
              >
                Try again
              </button>

            </div>
          )}


          {/* =====================================
              EMPTY
          ===================================== */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="products-empty">

                <PackageOpen
                  size={55}
                />

                <h2>
                  No products found
                </h2>

                <p>
                  Try changing your
                  filters or search
                  something else.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                >
                  Clear filters
                </button>

              </div>
            )}


          {/* =====================================
              PRODUCT GRID
          ===================================== */}

          {!loading &&
            !error &&
            products.length > 0 && (

              <div className="products-grid">

                {products.map(
                  (product) => (

                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="product-card"
                    >

                      {/* IMAGE */}

                      <div className="product-image-wrapper">

                        {/* =====================
                            WISHLIST BUTTON
                        ====================== */}

                        <button
                          type="button"
                          className={
                            wishlistIds.includes(
                              product._id
                            )
                              ? "product-wishlist-button active"
                              : "product-wishlist-button"
                          }
                          onClick={(event) =>
                            handleWishlistToggle(
                              event,
                              product._id
                            )
                          }
                          disabled={
                            wishlistLoading ===
                            product._id
                          }
                          aria-label={
                            wishlistIds.includes(
                              product._id
                            )
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          title={
                            wishlistIds.includes(
                              product._id
                            )
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >

                          <Heart
                            size={19}
                            fill={
                              wishlistIds.includes(
                                product._id
                              )
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>


                        {/* PRODUCT IMAGE */}

                        {product.image ? (

                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="product-image"
                          />

                        ) : (

                          <div className="product-no-image">

                            <PackageOpen
                              size={40}
                            />

                          </div>

                        )}


                        {/* STOCK */}

                        <span
                          className={
                            product.stock > 0
                              ? "product-stock in-stock"
                              : "product-stock out-stock"
                          }
                        >

                          {product.stock > 0
                            ? "IN STOCK"
                            : "SOLD OUT"}

                        </span>


                        {/* ARROW */}

                        <span className="product-view-arrow">

                          <ArrowRight
                            size={17}
                          />

                        </span>

                      </div>


                      {/* DETAILS */}

                      <div className="product-card-details">

                        <div className="product-card-category">

                          {product.category?.name ||
                            "Shopflow"}

                        </div>

                        <h3>
                          {product.name}
                        </h3>

                        <p className="product-description">

                          {product.description}

                        </p>


                        <div className="product-card-bottom">

                          <strong>

                            ₹
                            {product.price.toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                          <span>
                            View product
                          </span>

                        </div>

                      </div>

                    </Link>

                  )
                )}

              </div>

            )}

        </div>

      </section>

    </main>
  );
};

export default Products;