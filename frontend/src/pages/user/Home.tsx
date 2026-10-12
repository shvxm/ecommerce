import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Dumbbell,
  Gift,
  Headphones,
  Heart,
  Home as HomeIcon,
  Laptop,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Utensils,
  Watch,
  Truck,
  UserRound,
  Zap,
} from "lucide-react";

import { getCategories } from "../../services/categoryApi";
import { getProducts } from "../../services/productApi";

import "./Home.css";

interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
  category?: {
    _id?: string;
    name?: string;
  };
}

/* ================= HELPERS ================= */

const extractArray = (response: any): any[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
};

const categoryIcons: Record<string, any> = {
  electronics: Laptop,
  fashion: ShoppingBag,
  "home & kitchen": HomeIcon,
  sports: Dumbbell,
  beauty: Sparkles,
  books: BookOpen,
  grocery: Utensils,
  accessories: Watch,
};

const categoryImages: Record<string, string> = {
  electronics:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=70",

  fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&auto=format&fit=crop&q=70",

  "home & kitchen":
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=700&auto=format&fit=crop&q=70",

  sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700&auto=format&fit=crop&q=70",

  beauty:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&auto=format&fit=crop&q=70",

  books:
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&auto=format&fit=crop&q=70",
};

const fallbackProductImage =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=70";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getProductImage = (product: Product) => {
  if (product.image) {
    return product.image;
  }

  if (product.images && product.images.length > 0) {
    return product.images[0];
  }

  return fallbackProductImage;
};

/* ================= MOTION ================= */

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: index * 0.06,
      ease: "easeOut" as const,
    },
  }),
};

/* ================= HOME ================= */

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [search, setSearch] = useState("");

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await getCategories();

        console.log(
          "HOME CATEGORY RESPONSE:",
          response
        );

        const data = extractArray(response);

        console.log(
          "HOME CATEGORY ARRAY:",
          data
        );

        setCategories(data);
      } catch (error) {
        console.error(
          "Home categories error:",
          error
        );

        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const response = await getProducts({});

        console.log(
          "HOME PRODUCT RESPONSE:",
          response
        );

        const data = extractArray(response);

        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(
          "Home products error:",
          error
        );

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= CATEGORY FILTER ================= */

  const parentCategories = categories.filter(
    (category) =>
      !category.parentCategory
  );

  /* ================= SEARCH ================= */

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );
  };

  /* ================= CATEGORY CLICK ================= */

  const handleCategoryClick = (
    categoryId: string
  ) => {
    navigate(
      `/products?category=${categoryId}`
    );
  };

  /* ================= PRODUCT CLICK ================= */

  const handleProductClick = (
    productId: string
  ) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="hero-shape hero-shape-one" />
        <div className="hero-shape hero-shape-two" />

        <div className="home-container hero-container">

          {/* HERO CONTENT */}

          <motion.div
            className="hero-content"
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut" as const,
            }}
          >

            <motion.div
              className="hero-badge"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.4,
              }}
            >
              <Sparkles size={14} />
              <span>NEW COLLECTION 2026</span>
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.55,
              }}
            >
              Everything you need.
              <br />
              <span>One place.</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.5,
              }}
            >
              Discover trending products, everyday
              essentials and premium picks — all at
              prices you'll love.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.5,
              }}
            >

              <motion.button
                className="hero-primary-btn"
                onClick={() =>
                  navigate("/products")
                }
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Shop Now
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                className="hero-secondary-btn"
                onClick={() =>
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Explore Categories
              </motion.button>

            </motion.div>

          </motion.div>

          {/* HERO IMAGE */}

          <motion.div
            className="hero-visual"
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.15,
              duration: 0.65,
              ease: "easeOut" as const,
            }}
          >

            <motion.div
              className="hero-main-card"
              whileHover={{
                y: -5,
                scale: 1.01,
              }}
              transition={{
                duration: 0.25,
              }}
            >

              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=75"
                alt="ShopFlow collection"
              />

              <div className="hero-card-overlay" />

              <div className="hero-floating-card">

                <div className="floating-icon">
                  <ShoppingBag size={17} />
                </div>

                <div>
                  <strong>
                    500+ Products
                  </strong>

                  <span>
                    Ready to explore
                  </span>
                </div>

              </div>

            </motion.div>

            <motion.div
              className="hero-discount-card"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.45,
                duration: 0.4,
              }}
            >
              <Zap size={18} />

              <div>
                <strong>
                  Up to 40%
                </strong>

                <span>OFF</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <motion.section
        className="home-search-section"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.5,
          duration: 0.45,
        }}
      >
        <div className="home-container">

          <form
            className="home-search-box"
            onSubmit={handleSearch}
          >

            <Search size={20} />

            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
            >
              Search
            </motion.button>

          </form>

        </div>
      </motion.section>


      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section className="home-benefits">

        <div className="home-container benefits-grid">

          {[
            {
              icon: Truck,
              title: "Fast Delivery",
              text: "Quick & reliable shipping",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payment",
              text: "100% secure checkout",
            },
            {
              icon: Gift,
              title: "Easy Returns",
              text: "Simple return process",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              text: "We're here to help",
            },
          ].map((item, index) => {

            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                className="benefit-item"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
              >

                <div className="benefit-icon">
                  <Icon size={20} />
                </div>

                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.text}
                  </span>
                </div>

              </motion.div>
            );
          })}

        </div>
      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <motion.section
        id="categories"
        className="home-section categories-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
        }}
      >

        <div className="home-container">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                EXPLORE
              </span>

              <h2>
                Shop by category
              </h2>

              <p>
                Find exactly what you're looking for.
              </p>
            </div>

            <motion.button
              className="section-link"
              onClick={() =>
                navigate("/products")
              }
              whileHover={{
                x: 4,
              }}
            >
              View all
              <ArrowRight size={16} />
            </motion.button>

          </div>

          {loadingCategories ? (

            <div className="category-grid">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    className="category-skeleton"
                    key={item}
                  />
                )
              )}

            </div>

          ) : parentCategories.length > 0 ? (

            <div className="category-grid">

              {parentCategories
                .slice(0, 6)
                .map((category, index) => {

                  const normalizedName =
                    category.name
                      .toLowerCase()
                      .trim();

                  const Icon =
                    categoryIcons[
                      normalizedName
                    ] || ShoppingBag;

                  const image =
                    category.image ||
                    categoryImages[
                      normalizedName
                    ];

                  return (
                    <motion.button
                      key={category._id}
                      className="category-card"
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      whileHover={{
                        y: -5,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      onClick={() =>
                        handleCategoryClick(
                          category._id
                        )
                      }
                    >

                      <div className="category-image">

                        {image ? (
                          <img
                            src={image}
                            alt={category.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="category-fallback">
                            <Icon size={38} />
                          </div>
                        )}

                        <div className="category-overlay" />

                        <div className="category-icon">
                          <Icon size={18} />
                        </div>

                      </div>

                      <div className="category-info">

                        <h3>
                          {category.name}
                        </h3>

                        <span>
                          Shop now
                          <ChevronRight
                            size={14}
                          />
                        </span>

                      </div>

                    </motion.button>
                  );
                })}

            </div>

          ) : (

            <div className="category-empty">

              <ShoppingBag size={34} />

              <h3>
                No categories available
              </h3>

              <p>
                Categories will appear here once
                they are added.
              </p>

              <button
                onClick={() =>
                  navigate("/products")
                }
              >
                Browse Products
              </button>

            </div>

          )}

        </div>
      </motion.section>


      {/* =====================================================
          TRENDING PRODUCTS
      ===================================================== */}

      <motion.section
        className="home-section products-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
        }}
      >

        <div className="home-container">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                TRENDING NOW
              </span>

              <h2>
                Popular picks
              </h2>

              <p>
                Products worth checking out.
              </p>
            </div>

            <motion.button
              className="section-link"
              onClick={() =>
                navigate("/products")
              }
              whileHover={{
                x: 4,
              }}
            >
              View all
              <ArrowRight size={16} />
            </motion.button>

          </div>

          {loadingProducts ? (

            <div className="product-home-grid">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    className="product-skeleton"
                    key={item}
                  />
                )
              )}

            </div>

          ) : products.length > 0 ? (

            <div className="product-home-grid">

              {products.map(
                (product, index) => (

                  <motion.article
                    key={product._id}
                    className="home-product-card"
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.12,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                  >

                    <div
                      className="home-product-image"
                      onClick={() =>
                        handleProductClick(
                          product._id
                        )
                      }
                    >

                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={product.name}
                        loading="lazy"
                      />

                      <motion.button
                        className="home-product-wishlist"
                        type="button"
                        whileHover={{
                          scale: 1.08,
                        }}
                        whileTap={{
                          scale: 0.88,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate("/wishlist");
                        }}
                      >
                        <Heart size={17} />
                      </motion.button>

                      {index < 2 && (
                        <span className="trending-badge">
                          TRENDING
                        </span>
                      )}

                    </div>

                    <div className="home-product-content">

                      <div className="home-product-category">
                        {product.category?.name ||
                          "Featured"}
                      </div>

                      <h3
                        onClick={() =>
                          handleProductClick(
                            product._id
                          )
                        }
                      >
                        {product.name}
                      </h3>

                      <div className="product-rating">

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <span>
                          4.8
                        </span>

                        <span className="rating-count">
                          (120+)
                        </span>

                      </div>

                      <div className="home-product-bottom">

                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                        <motion.button
                          type="button"
                          whileHover={{
                            scale: 1.04,
                          }}
                          whileTap={{
                            scale: 0.96,
                          }}
                          onClick={() =>
                            handleProductClick(
                              product._id
                            )
                          }
                        >
                          View
                          <ArrowUpRight
                            size={14}
                          />
                        </motion.button>

                      </div>

                    </div>

                  </motion.article>
                )
              )}

            </div>

          ) : (

            <div className="category-empty">

              <ShoppingBag size={34} />

              <h3>
                No products available
              </h3>

              <p>
                Products will appear here once
                vendors add them.
              </p>

              <button
                onClick={() =>
                  navigate("/products")
                }
              >
                Browse Products
              </button>

            </div>

          )}

        </div>
      </motion.section>


      {/* =====================================================
          DEAL BANNER
      ===================================================== */}

      <motion.section
        className="home-deal-section"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div className="home-container">

          <div className="deal-banner">

            <div className="deal-content">

              <div className="deal-icon">
                <Zap size={23} />
              </div>

              <div>

                <span className="deal-label">
                  LIMITED TIME OFFER
                </span>

                <h2>
                  Big savings.
                  <br />
                  Bigger shopping.
                </h2>

                <p>
                  Discover selected products at
                  special prices.
                </p>

              </div>

            </div>

            <div className="deal-offer">

              <strong>
                UP TO
              </strong>

              <span>
                40%
              </span>

              <small>
                OFF
              </small>

              <motion.button
                onClick={() =>
                  navigate("/products")
                }
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Shop deals
                <ArrowRight size={16} />
              </motion.button>

            </div>

          </div>

        </div>
      </motion.section>


      {/* =====================================================
          WHY SHOPFLOW
      ===================================================== */}

      <motion.section
        className="home-section why-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
      >

        <div className="home-container">

          <div className="why-layout">

            <div className="why-content">

              <span className="section-eyebrow">
                WHY SHOPFLOW
              </span>

              <h2>
                Shopping should feel
                <span> effortless.</span>
              </h2>

              <p>
                Products, trusted vendors, secure
                payments and a smooth shopping
                experience — all in one place.
              </p>

              <motion.button
                className="why-btn"
                onClick={() =>
                  navigate("/products")
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                Start shopping
                <ArrowRight size={17} />
              </motion.button>

            </div>

            <div className="why-features">

              {[
                {
                  icon: ShieldCheck,
                  title: "Secure checkout",
                  text: "Your payments stay protected.",
                },
                {
                  icon: Truck,
                  title: "Reliable delivery",
                  text: "Get your orders delivered safely.",
                },
                {
                  icon: UserRound,
                  title: "Trusted vendors",
                  text: "Shop from verified sellers.",
                },
                {
                  icon: Star,
                  title: "Quality products",
                  text: "Products selected for you.",
                },
              ].map((item, index) => {

                const Icon = item.icon;

                return (
                  <motion.div
                    className="why-feature"
                    key={item.title}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                  >

                    <div className="why-feature-icon">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>
                    </div>

                  </motion.div>
                );

              })}

            </div>

          </div>

        </div>
      </motion.section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <motion.section
        className="home-final-cta"
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div className="home-container">

          <div className="final-cta-inner">

            <div>

              <span>
                READY TO EXPLORE?
              </span>

              <h2>
                Find something
                you'll love.
              </h2>

            </div>

            <motion.button
              onClick={() =>
                navigate("/products")
              }
              whileHover={{
                y: -2,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              Explore products
              <ArrowRight size={17} />
            </motion.button>

          </div>

        </div>
      </motion.section>

    </main>
  );
};

export default Home;