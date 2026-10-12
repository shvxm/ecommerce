import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { addToCart } from "../../services/cartApi";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ShieldCheck,
  Heart,
  Truck,
  RotateCcw,
  UserRound,
  Send,
} from "lucide-react";

import api from "../../services/api";
import type { Product } from "../../types";

import "./ProductDetails.css";

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Similar products
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Product ID is missing.");
          return;
        }

        const response =
          await api.get<ProductResponse>(`/products/${id}`);

        setProduct(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);

        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ========================================
  // CHECK WISHLIST
  // ========================================

  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token || !id) {
        return;
      }

      try {
        const response = await getWishlist();

        const wishlistProducts =
          response?.data?.products || [];

        const exists = wishlistProducts.some(
          (wishlistProduct: Product) =>
            wishlistProduct._id === id
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error(
          "Failed to check wishlist:",
          error
        );
      }
    };

    checkWishlist();
  }, [id]);

  // ========================================
  // FETCH SIMILAR PRODUCTS
  // ========================================

  useEffect(() => {
    if (!product?.category?._id) {
      return;
    }

    const fetchSimilarProducts = async () => {
      try {
        setSimilarLoading(true);

        const response =
          await api.get<ProductsResponse>(
            `/products?category=${product.category._id}`
          );

        const filteredProducts =
          response.data.data
            .filter(
              (item) => item._id !== product._id
            )
            .slice(0, 4);

        setSimilarProducts(filteredProducts);
      } catch (error) {
        console.error(
          "Failed to fetch similar products:",
          error
        );
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [product]);

  // ========================================
  // FETCH REVIEWS
  // ========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response =
          await api.get<ReviewsResponse>(
            `/reviews/product/${id}`
          );

        setReviews(response.data.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error
        );

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // ========================================
  // WISHLIST TOGGLE
  // ========================================

  const handleWishlistToggle = async () => {
    if (!product) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product._id);
        setIsWishlisted(true);
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // ========================================
  // QUANTITY
  // ========================================

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    try {
      await addToCart(
        product._id,
        quantity
      );

      alert(
        "Product added to cart successfully!"
      );
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );

      alert(
        "Failed to add product to cart."
      );
    }
  };

  // ========================================
  // SUBMIT REVIEW
  // ========================================

  const handleSubmitReview = async () => {
    if (!id) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write your review.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const response =
        await api.post<{
          success: boolean;
          message: string;
          data: Review;
        }>(`/reviews/${id}`, {
          rating: reviewRating,
          comment: reviewComment.trim(),
        });

      setReviews((prev) => [
        response.data.data,
        ...prev,
      ]);

      setReviewComment("");
      setReviewRating(5);

      alert("Review submitted successfully!");
    } catch (error: any) {
      console.error(
        "Failed to submit review:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatReviewDate = (
    date: string
  ) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // AVERAGE RATING
  // ========================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-state">
          <div className="loader"></div>

          <p>
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-state">
          <h2>
            Product not found
          </h2>

          <p>
            {error ||
              "The product you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="container">

        {/* BACK */}

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/products")
          }
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        {/* ==================================
            PRODUCT DETAILS
        ================================== */}

        <section className="product-details">

          {/* IMAGE */}

          <div className="product-details-image">

            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="product-details-placeholder">
                Product Image
              </div>
            )}

            {/* WISHLIST */}

            <button
              type="button"
              className={
                isWishlisted
                  ? "product-details-wishlist active"
                  : "product-details-wishlist"
              }
              onClick={
                handleWishlistToggle
              }
              disabled={wishlistLoading}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                size={22}
                fill={
                  isWishlisted
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

          {/* PRODUCT INFO */}

          <div className="product-details-info">

            <span className="product-details-category">
              {product.category?.name}
            </span>

            <h1>
              {product.name}
            </h1>

            <div className="product-details-rating">

              <span>
                <Star
                  size={16}
                  fill="currentColor"
                />

                {reviews.length > 0
                  ? averageRating
                  : "4.8"}
              </span>

              <small>
                {reviews.length > 0
                  ? `${reviews.length} customer reviews`
                  : "Trusted seller"}
              </small>

            </div>

            <div className="product-details-price">
              ₹
              {product.price.toLocaleString(
                "en-IN"
              )}
            </div>

            <p className="product-details-description">
              {product.description}
            </p>

            {/* STOCK */}

            <div className="product-stock">

              <span
                className={
                  product.stock > 0
                    ? "stock-available"
                    : "stock-unavailable"
                }
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>

            </div>

            {/* QUANTITY */}

            {product.stock > 0 && (
              <div className="quantity-section">

                <span>
                  Quantity
                </span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                  >
                    <Plus size={15} />
                  </button>

                </div>

              </div>
            )}

            {/* ADD CART */}

            <button
              type="button"
              className="details-add-cart"
              disabled={
                product.stock <= 0
              }
              onClick={
                handleAddToCart
              }
            >
              <ShoppingCart
                size={18}
              />

              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>

            {/* BENEFITS */}

            <div className="product-benefits">

              <div>
                <ShieldCheck
                  size={19}
                />

                <span>
                  Secure purchase
                </span>
              </div>

              <div>
                <Truck size={19} />

                <span>
                  Fast delivery
                </span>
              </div>

              <div>
                <RotateCcw
                  size={19}
                />

                <span>
                  Easy returns
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ==================================
            SIMILAR PRODUCTS
        ================================== */}

        <section className="similar-products-section">

          <div className="section-heading">

            <div>
              <span>
                YOU MAY ALSO LIKE
              </span>

              <h2>
                Similar Products
              </h2>
            </div>

            <Link to="/products">
              View All
            </Link>

          </div>

          {similarLoading ? (
            <div className="similar-loading">
              Loading similar products...
            </div>
          ) : similarProducts.length === 0 ? (
            <div className="similar-empty">
              No similar products found.
            </div>
          ) : (
            <div className="similar-products-grid">

              {similarProducts.map(
                (item) => (
                  <Link
                    key={item._id}
                    to={`/products/${item._id}`}
                    className="similar-product-card"
                  >

                    <div className="similar-product-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          No Image
                        </span>
                      )}

                    </div>

                    <div className="similar-product-info">

                      <span>
                        {item.category?.name}
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <div className="similar-product-bottom">

                        <strong>
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <div>
                          <Star
                            size={14}
                            fill="currentColor"
                          />
                          4.8
                        </div>

                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>
          )}

        </section>

        {/* ==================================
            REVIEWS
        ================================== */}

        <section className="reviews-section">

          <div className="section-heading">

            <div>
              <span>
                CUSTOMER FEEDBACK
              </span>

              <h2>
                Customer Reviews
              </h2>
            </div>

          </div>

          <div className="reviews-layout">

            {/* RATING SUMMARY */}

            <div className="rating-summary">

              <div className="average-rating">
                {averageRating}
              </div>

              <div className="rating-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={
                        star <=
                        Math.round(
                          Number(
                            averageRating
                          )
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )
                )}

              </div>

              <p>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </p>

            </div>

            {/* REVIEW LIST */}

            <div className="reviews-list">

              {reviewsLoading ? (
                <div className="reviews-message">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="reviews-message">
                  <h3>
                    No reviews yet
                  </h3>

                  <p>
                    Be the first person to
                    review this product.
                  </p>
                </div>
              ) : (
                reviews.map(
                  (review) => (
                    <article
                      className="review-card"
                      key={review._id}
                    >

                      <div className="review-header">

                        <div className="review-user">

                          <div className="review-avatar">
                            <UserRound
                              size={17}
                            />
                          </div>

                          <div>
                            <strong>
                              {
                                review.user
                                  ?.name
                              }
                            </strong>

                            <small>
                              Verified customer
                            </small>
                          </div>

                        </div>

                        <span className="review-date">
                          {formatReviewDate(
                            review.createdAt
                          )}
                        </span>

                      </div>

                      <div className="review-stars">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={15}
                              fill={
                                star <=
                                review.rating
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )
                        )}

                      </div>

                      <p>
                        {review.comment}
                      </p>

                    </article>
                  )
                )
              )}

            </div>

          </div>

          {/* WRITE REVIEW */}

          <div className="write-review">

            <div className="write-review-heading">

              <div>
                <span>
                  SHARE YOUR EXPERIENCE
                </span>

                <h3>
                  Write a Review
                </h3>
              </div>

              <Star
                size={28}
                fill="currentColor"
              />

            </div>

            <div className="review-rating-input">

              <label>
                Your Rating
              </label>

              <div>
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      className={
                        star <=
                        reviewRating
                          ? "rating-star-button active"
                          : "rating-star-button"
                      }
                      onClick={() =>
                        setReviewRating(
                          star
                        )
                      }
                    >
                      <Star
                        size={23}
                        fill={
                          star <=
                          reviewRating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  )
                )}
              </div>

            </div>

            <textarea
              value={reviewComment}
              onChange={(event) =>
                setReviewComment(
                  event.target.value
                )
              }
              placeholder="Tell other customers what you think about this product..."
              rows={5}
              maxLength={500}
            />

            <div className="review-form-footer">

              <small>
                {reviewComment.length}/500
              </small>

              <button
                type="button"
                onClick={
                  handleSubmitReview
                }
                disabled={
                  reviewSubmitting
                }
              >
                <Send size={16} />

                {reviewSubmitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

export default ProductDetails;