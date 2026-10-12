import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import "./Wishlist.css";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category?: {
    _id: string;
    name: string;
  };
}

interface WishlistData {
  user: string;
  products: Product[];
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getWishlist();

      setWishlist(response.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);

      const response =
        await removeFromWishlist(productId);

      setWishlist(response.data);
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          Loading wishlist...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-error">
          {error}
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

        {/* HEADER */}
        <div className="wishlist-header">

          <div>
            <span className="wishlist-eyebrow">
              YOUR COLLECTION
            </span>

            <h1>
              My Wishlist
            </h1>

            <p>
              Products you've saved for later.
            </p>
          </div>

          <div className="wishlist-count">
            <Heart size={18} fill="currentColor" />
            {products.length}{" "}
            {products.length === 1
              ? "Item"
              : "Items"}
          </div>

        </div>


        {/* EMPTY STATE */}
        {products.length === 0 ? (

          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <Heart size={42} />
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save products you love and
              come back to them later.
            </p>

            <Link
              to="/products"
              className="wishlist-shop-button"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          /* PRODUCTS */
          <div className="wishlist-grid">

            {products.map((product) => (

              <div
                className="wishlist-card"
                key={product._id}
              >

                {/* IMAGE */}
                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-image-wrapper"
                >

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      className="wishlist-image"
                    />

                  ) : (

                    <div className="wishlist-no-image">
                      <PackageOpen size={42} />
                    </div>

                  )}

                  <span
                    className={
                      product.stock > 0
                        ? "wishlist-stock in-stock"
                        : "wishlist-stock out-stock"
                    }
                  >
                    {product.stock > 0
                      ? "IN STOCK"
                      : "SOLD OUT"}
                  </span>

                </Link>


                {/* DETAILS */}
                <div className="wishlist-card-content">

                  <span className="wishlist-category">
                    {product.category?.name ||
                      "Shopflow"}
                  </span>

                  <Link
                    to={`/products/${product._id}`}
                    className="wishlist-product-name"
                  >
                    {product.name}
                  </Link>

                  <p className="wishlist-description">
                    {product.description}
                  </p>


                  <div className="wishlist-card-bottom">

                    <strong>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <div className="wishlist-actions">

                      <Link
                        to={`/products/${product._id}`}
                        className="wishlist-cart-button"
                        title="View product"
                      >
                        <ShoppingCart size={17} />
                      </Link>

                      <button
                        className="wishlist-remove-button"
                        onClick={() =>
                          handleRemove(product._id)
                        }
                        disabled={
                          removingId === product._id
                        }
                        title="Remove from wishlist"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Wishlist;