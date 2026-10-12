import { useEffect, useState } from "react";

import {

  Minus,

  Plus,

  Trash2,

  ShoppingBag,

  ArrowRight,

  ShieldCheck

} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import {

  getCart,

  updateCartItem,

  removeFromCart,

  clearCart

} from "../../services/cartApi";

import type { Cart as CartData } from "../../services/cartApi";

import "./Cart.css";

const Cart = () => {

  const navigate = useNavigate();

  const [cart, setCart] = useState<CartData | null>(null);

  const [loading, setLoading] = useState(true);

  const [updatingProduct, setUpdatingProduct] =

    useState<string | null>(null);

  const [error, setError] = useState("");

  const fetchCart = async () => {

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/login");

      return;

    }

    try {

      setLoading(true);

      setError("");

      const data = await getCart();

      setCart(data);

    } catch (error: any) {

      console.error("Failed to fetch cart:", error);

      setError(

        error?.response?.data?.message ||

          "Failed to load cart."

      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCart();

  }, []);

  const handleQuantityChange = async (

    productId: string,

    newQuantity: number,

    stock: number

  ) => {

    if (newQuantity < 1) {

      return;

    }

    if (newQuantity > stock) {

      setError(

        `Only ${stock} items are available in stock.`

      );

      return;

    }

    try {

      setUpdatingProduct(productId);

      setError("");

      const updatedCart =

        await updateCartItem(

          productId,

          newQuantity

        );

      setCart(updatedCart);

    } catch (error: any) {

      console.error(

        "Failed to update cart:",

        error

      );

      setError(

        error?.response?.data?.message ||

          "Failed to update cart."

      );

    } finally {

      setUpdatingProduct(null);

    }

  };

  const handleRemove = async (

    productId: string

  ) => {

    try {

      setUpdatingProduct(productId);

      setError("");

      const updatedCart =

        await removeFromCart(productId);

      setCart(updatedCart);

    } catch (error: any) {

      console.error(

        "Failed to remove item:",

        error

      );

      setError(

        error?.response?.data?.message ||

          "Failed to remove item."

      );

    } finally {

      setUpdatingProduct(null);

    }

  };

  const handleClearCart = async () => {

    try {

      setLoading(true);

      setError("");

      const updatedCart =

        await clearCart();

      setCart(updatedCart);

    } catch (error: any) {

      console.error(

        "Failed to clear cart:",

        error

      );

      setError(

        error?.response?.data?.message ||

          "Failed to clear cart."

      );

    } finally {

      setLoading(false);

    }

  };

  const formatPrice = (price: number) => {

    return new Intl.NumberFormat(

      "en-IN",

      {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 0

      }

    ).format(price);

  };

  if (loading) {

    return (

      <main className="cart-page">

        <div className="cart-loading">

          Loading your cart...

        </div>

      </main>

    );

  }

  if (!cart || cart.items.length === 0) {

    return (

      <main className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">

            <ShoppingBag size={48} />

          </div>

          <h1>Your Cart is Empty</h1>

          <p>

            Looks like you haven't added

            anything to your cart yet.

          </p>

          <Link

            to="/products"

            className="continue-shopping-btn"

          >

            Continue Shopping

            <ArrowRight size={18} />

          </Link>

        </div>

      </main>

    );

  }

  return (

    <main className="cart-page">

      <div className="cart-container">

        <div className="cart-header">

          <div>

            <h1>Shopping Cart</h1>

            <p>

              {cart.totalItems}{" "}

              {cart.totalItems === 1

                ? "item"

                : "items"}{" "}

              in your cart

            </p>

          </div>

          <button

            type="button"

            className="clear-cart-btn"

            onClick={handleClearCart}

          >

            <Trash2 size={17} />

            Clear Cart

          </button>

        </div>

        {error && (

          <div className="cart-error">

            {error}

          </div>

        )}

        <div className="cart-layout">

          <section className="cart-items-section">

            {cart.items.map((item) => {

              const product =

                item.product;

              const isUpdating =

                updatingProduct ===

                product._id;

              return (

                <article

                  className="cart-item"

                  key={product._id}

                >

                  <div className="cart-product-image">

                    <img

                      src={

                        product.image ||

                        "/images/placeholder.jpg"

                      }

                      alt={product.name}

                    />

                  </div>

                  <div className="cart-item-details">

                    <Link

                      to={`/products/${product._id}`}

                      className="cart-product-name"

                    >

                      {product.name}

                    </Link>

                    <p className="cart-stock">

                      {product.stock > 0

                        ? `${product.stock} available`

                        : "Out of stock"}

                    </p>

                    <div className="cart-item-bottom">

                      <strong className="cart-product-price">

                        {formatPrice(

                          product.price

                        )}

                      </strong>

                      <div className="cart-actions">

                        <div className="quantity-control">

                          <button

                            type="button"

                            disabled={

                              isUpdating ||

                              item.quantity <= 1

                            }

                            onClick={() =>

                              handleQuantityChange(

                                product._id,

                                item.quantity - 1,

                                product.stock

                              )

                            }

                          >

                            <Minus size={16} />

                          </button>

                          <span>

                            {isUpdating

                              ? "..."

                              : item.quantity}

                          </span>

                          <button

                            type="button"

                            disabled={

                              isUpdating ||

                              item.quantity >=

                                product.stock

                            }

                            onClick={() =>

                              handleQuantityChange(

                                product._id,

                                item.quantity + 1,

                                product.stock

                              )

                            }

                          >

                            <Plus size={16} />

                          </button>

                        </div>

                        <button

                          type="button"

                          className="remove-item-btn"

                          disabled={

                            isUpdating

                          }

                          onClick={() =>

                            handleRemove(

                              product._id

                            )

                          }

                        >

                          <Trash2 size={17} />

                          Remove

                        </button>

                      </div>

                    </div>

                  </div>

                </article>

              );

            })}

          </section>

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>

                Items (

                {cart.totalItems})

              </span>

              <strong>

                {formatPrice(

                  cart.totalAmount

                )}

              </strong>

            </div>

            <div className="summary-row">

              <span>Delivery</span>

              <strong className="free-delivery">

                FREE

              </strong>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>Total</span>

              <strong>

                {formatPrice(

                  cart.totalAmount

                )}

              </strong>

            </div>

            <button

              type="button"

              className="checkout-btn"

              onClick={() =>

                navigate("/checkout")

              }

            >

              Proceed to Checkout

              <ArrowRight size={18} />

            </button>

            <div className="secure-checkout">

              <ShieldCheck size={18} />

              <span>

                Secure checkout

              </span>

            </div>

          </aside>

        </div>

      </div>

    </main>

  );

};

export default Cart;