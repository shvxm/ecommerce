require("dotenv").config();

const Product = require("../modules/products/product.model");
const Category = require("../modules/categories/category.model");
const Vendor = require("../modules/vendors/vendor.model");

const connectDB = require("../config/db");

const seedProducts = async () => {
  try {
    // ==========================================
    // CONNECT TO MONGODB
    // ==========================================

    await connectDB();

    console.log("MongoDB connected");


    // ==========================================
    // CREATE PARENT CATEGORIES
    // ==========================================

    const parentCategoryData = [
      {
        name: "Electronics",
        description:
          "Latest electronic gadgets and devices"
      },
      {
        name: "Fashion",
        description:
          "Trendy clothing, footwear and accessories"
      },
      {
        name: "Home & Kitchen",
        description:
          "Useful products for your home and kitchen"
      },
      {
        name: "Sports",
        description:
          "Sports, fitness and outdoor products"
      },
      {
        name: "Beauty",
        description:
          "Beauty, grooming and personal care products"
      },
      {
        name: "Books",
        description:
          "Books for learning, productivity and entertainment"
      }
    ];


    // ==========================================
    // STORE CATEGORY IDS
    // ==========================================

    const categories = {};


    // ==========================================
    // CREATE / FIND PARENT CATEGORIES
    // ==========================================

    for (const category of parentCategoryData) {
      let existingCategory =
        await Category.findOne({
          name: category.name
        });

      if (!existingCategory) {
        existingCategory =
          await Category.create(category);

        console.log(
          `Parent category created: ${category.name}`
        );
      } else {
        console.log(
          `Parent category already exists: ${category.name}`
        );
      }

      categories[category.name] =
        existingCategory._id;
    }


    // ==========================================
    // CREATE SUBCATEGORIES
    // ==========================================

    const subCategoryData = [
      // ELECTRONICS
      {
        name: "Smartphones",
        description:
          "Latest smartphones and mobile devices",
        parentCategory:
          categories["Electronics"]
      },

      {
        name: "Laptops",
        description:
          "Laptops and portable computers",
        parentCategory:
          categories["Electronics"]
      },

      {
        name: "Audio",
        description:
          "Headphones, earbuds and audio devices",
        parentCategory:
          categories["Electronics"]
      },

      {
        name: "Smartwatches",
        description:
          "Smartwatches and wearable devices",
        parentCategory:
          categories["Electronics"]
      },


      // FASHION
      {
        name: "T-Shirts",
        description:
          "Casual and oversized t-shirts",
        parentCategory:
          categories["Fashion"]
      },

      {
        name: "Hoodies",
        description:
          "Comfortable hoodies and sweatshirts",
        parentCategory:
          categories["Fashion"]
      },

      {
        name: "Jackets",
        description:
          "Casual and premium jackets",
        parentCategory:
          categories["Fashion"]
      },

      {
        name: "Shoes",
        description:
          "Casual and everyday footwear",
        parentCategory:
          categories["Fashion"]
      },

      {
        name: "Watches",
        description:
          "Classic and analog watches",
        parentCategory:
          categories["Fashion"]
      },


      // HOME & KITCHEN
      {
        name: "Kitchen Appliances",
        description:
          "Useful appliances for modern kitchens",
        parentCategory:
          categories["Home & Kitchen"]
      },

      {
        name: "Coffee & Beverage",
        description:
          "Coffee makers and beverage products",
        parentCategory:
          categories["Home & Kitchen"]
      },

      {
        name: "Lighting",
        description:
          "Decorative and functional lighting",
        parentCategory:
          categories["Home & Kitchen"]
      },

      {
        name: "Cookware",
        description:
          "Cookware and kitchen utensils",
        parentCategory:
          categories["Home & Kitchen"]
      },


      // SPORTS
      {
        name: "Running",
        description:
          "Running shoes and running accessories",
        parentCategory:
          categories["Sports"]
      },

      {
        name: "Football",
        description:
          "Football equipment and accessories",
        parentCategory:
          categories["Sports"]
      },

      {
        name: "Gym & Fitness",
        description:
          "Gym equipment and fitness products",
        parentCategory:
          categories["Sports"]
      },

      {
        name: "Sports Accessories",
        description:
          "Bags and useful sports accessories",
        parentCategory:
          categories["Sports"]
      },


      // BEAUTY
      {
        name: "Skincare",
        description:
          "Daily skincare and personal care products",
        parentCategory:
          categories["Beauty"]
      },

      {
        name: "Fragrance",
        description:
          "Fragrances and perfumes",
        parentCategory:
          categories["Beauty"]
      },

      {
        name: "Hair Care",
        description:
          "Hair styling and hair care products",
        parentCategory:
          categories["Beauty"]
      },


      // BOOKS
      {
        name: "Programming",
        description:
          "Programming and software development books",
        parentCategory:
          categories["Books"]
      },

      {
        name: "Self Improvement",
        description:
          "Books about habits and personal growth",
        parentCategory:
          categories["Books"]
      },

      {
        name: "Business",
        description:
          "Business and entrepreneurship books",
        parentCategory:
          categories["Books"]
      }
    ];


    // ==========================================
    // CREATE / FIND SUBCATEGORIES
    // ==========================================

    for (const category of subCategoryData) {
      let existingCategory =
        await Category.findOne({
          name: category.name
        });

      if (!existingCategory) {
        existingCategory =
          await Category.create(category);

        console.log(
          `Subcategory created: ${category.name}`
        );
      } else {
        console.log(
          `Subcategory already exists: ${category.name}`
        );
      }

      categories[category.name] =
        existingCategory._id;
    }


    // ==========================================
    // FIND APPROVED VENDOR
    // ==========================================

    const vendor = await Vendor.findOne({
      status: "APPROVED"
    });

    if (!vendor) {
      throw new Error(
        "No approved vendor found. Please approve a vendor first."
      );
    }

    console.log(
      `Using vendor: ${vendor.businessName}`
    );


    // ==========================================
    // PRODUCTS
    // ==========================================

    const products = [

      // ========================================
      // ELECTRONICS - SMARTPHONES
      // ========================================

      {
        name: "iPhone 16",
        description:
          "Latest Apple smartphone with powerful performance, advanced camera system and premium design.",
        price: 74999,
        stock: 100,
        category:
          categories["Smartphones"],
        vendor:
          vendor._id,
        image:
          "/images/iphone-16.jpg",
        isActive: true
      },

      {
        name: "Samsung Galaxy S25",
        description:
          "Premium Android smartphone with powerful performance, excellent camera and modern design.",
        price: 79999,
        stock: 35,
        category:
          categories["Smartphones"],
        vendor:
          vendor._id,
        image:
          "/images/samsung-s25.jpg",
        isActive: true
      },


      // ========================================
      // ELECTRONICS - AUDIO
      // ========================================

      {
        name: "AirPods Pro 2",
        description:
          "Wireless earbuds with active noise cancellation, transparency mode and immersive sound.",
        price: 24999,
        stock: 50,
        category:
          categories["Audio"],
        vendor:
          vendor._id,
        image:
          "/images/airpods-pro.jpg",
        isActive: true
      },

      {
        name: "Sony WH-1000XM5",
        description:
          "Premium wireless noise cancelling headphones with high quality audio and long battery life.",
        price: 29999,
        stock: 25,
        category:
          categories["Audio"],
        vendor:
          vendor._id,
        image:
          "/images/sony-wh1000xm5.jpg",
        isActive: true
      },


      // ========================================
      // ELECTRONICS - LAPTOPS
      // ========================================

      {
        name: "MacBook Air M4",
        description:
          "Lightweight Apple laptop powered by the M4 chip for work, coding and everyday productivity.",
        price: 99999,
        stock: 15,
        category:
          categories["Laptops"],
        vendor:
          vendor._id,
        image:
          "/images/macbook-air-m4.jpg",
        isActive: true
      },


      // ========================================
      // ELECTRONICS - SMARTWATCHES
      // ========================================

      {
        name: "Apple Watch Series 10",
        description:
          "Smartwatch with fitness tracking, health features, notifications and a premium display.",
        price: 46999,
        stock: 20,
        category:
          categories["Smartwatches"],
        vendor:
          vendor._id,
        image:
          "/images/apple-watch.jpg",
        isActive: true
      },


      // ========================================
      // FASHION - T-SHIRTS
      // ========================================

      {
        name: "Oversized Black T-Shirt",
        description:
          "Comfortable oversized cotton t-shirt with a clean streetwear-inspired design.",
        price: 899,
        stock: 80,
        category:
          categories["T-Shirts"],
        vendor:
          vendor._id,
        image:
          "/images/oversized-tshirt.jpg",
        isActive: true
      },


      // ========================================
      // FASHION - HOODIES
      // ========================================

      {
        name: "Premium Black Hoodie",
        description:
          "Soft heavyweight hoodie designed for comfort and everyday streetwear style.",
        price: 1799,
        stock: 60,
        category:
          categories["Hoodies"],
        vendor:
          vendor._id,
        image:
          "/images/black-hoodie.jpg",
        isActive: true
      },


      // ========================================
      // FASHION - JACKETS
      // ========================================

      {
        name: "Classic Denim Jacket",
        description:
          "Classic blue denim jacket suitable for casual everyday outfits.",
        price: 2499,
        stock: 30,
        category:
          categories["Jackets"],
        vendor:
          vendor._id,
        image:
          "/images/denim-jacket.jpg",
        isActive: true
      },


      // ========================================
      // FASHION - SHOES
      // ========================================

      {
        name: "Urban Sneakers",
        description:
          "Stylish everyday sneakers with comfortable cushioning and modern design.",
        price: 2999,
        stock: 45,
        category:
          categories["Shoes"],
        vendor:
          vendor._id,
        image:
          "/images/urban-sneakers.jpg",
        isActive: true
      },


      // ========================================
      // FASHION - WATCHES
      // ========================================

      {
        name: "Classic Analog Watch",
        description:
          "Minimal analog wrist watch with a premium dial and comfortable strap.",
        price: 1999,
        stock: 40,
        category:
          categories["Watches"],
        vendor:
          vendor._id,
        image:
          "/images/classic-watch.jpg",
        isActive: true
      },


      // ========================================
      // HOME & KITCHEN - APPLIANCES
      // ========================================

      {
        name: "Digital Air Fryer",
        description:
          "Large capacity air fryer for quick and convenient low-oil cooking.",
        price: 4999,
        stock: 25,
        category:
          categories["Kitchen Appliances"],
        vendor:
          vendor._id,
        image:
          "/images/air-fryer.jpg",
        isActive: true
      },


      // ========================================
      // HOME & KITCHEN - COFFEE
      // ========================================

      {
        name: "Automatic Coffee Maker",
        description:
          "Compact automatic coffee maker for preparing fresh coffee at home.",
        price: 6999,
        stock: 18,
        category:
          categories["Coffee & Beverage"],
        vendor:
          vendor._id,
        image:
          "/images/coffee-maker.jpg",
        isActive: true
      },


      // ========================================
      // HOME & KITCHEN - LIGHTING
      // ========================================

      {
        name: "Modern Table Lamp",
        description:
          "Minimal decorative table lamp perfect for bedrooms, desks and study spaces.",
        price: 1299,
        stock: 55,
        category:
          categories["Lighting"],
        vendor:
          vendor._id,
        image:
          "/images/table-lamp.jpg",
        isActive: true
      },


      // ========================================
      // HOME & KITCHEN - COOKWARE
      // ========================================

      {
        name: "Non-Stick Cookware Set",
        description:
          "Complete non-stick cookware set designed for everyday kitchen use.",
        price: 3499,
        stock: 30,
        category:
          categories["Cookware"],
        vendor:
          vendor._id,
        image:
          "/images/cookware-set.jpg",
        isActive: true
      },


      // ========================================
      // SPORTS - RUNNING
      // ========================================

      {
        name: "Running Shoes",
        description:
          "Lightweight running shoes with cushioned sole for daily training and workouts.",
        price: 2799,
        stock: 50,
        category:
          categories["Running"],
        vendor:
          vendor._id,
        image:
          "/images/running-shoes.jpg",
        isActive: true
      },


      // ========================================
      // SPORTS - FOOTBALL
      // ========================================

      {
        name: "Premium Football",
        description:
          "Durable football suitable for training, practice and recreational matches.",
        price: 999,
        stock: 70,
        category:
          categories["Football"],
        vendor:
          vendor._id,
        image:
          "/images/football.jpg",
        isActive: true
      },


      // ========================================
      // SPORTS - FITNESS
      // ========================================

      {
        name: "Adjustable Dumbbells",
        description:
          "Adjustable dumbbell set for strength training and home workouts.",
        price: 4999,
        stock: 20,
        category:
          categories["Gym & Fitness"],
        vendor:
          vendor._id,
        image:
          "/images/dumbbells.jpg",
        isActive: true
      },


      // ========================================
      // SPORTS - ACCESSORIES
      // ========================================

      {
        name: "Gym Training Bag",
        description:
          "Spacious gym bag with multiple compartments for workout essentials.",
        price: 1499,
        stock: 40,
        category:
          categories["Sports Accessories"],
        vendor:
          vendor._id,
        image:
          "/images/gym-bag.jpg",
        isActive: true
      },


      // ========================================
      // BEAUTY - SKINCARE
      // ========================================

      {
        name: "Vitamin C Face Wash",
        description:
          "Gentle face wash formulated for everyday cleansing and refreshed skin.",
        price: 499,
        stock: 100,
        category:
          categories["Skincare"],
        vendor:
          vendor._id,
        image:
          "/images/face-wash.jpg",
        isActive: true
      },


      // ========================================
      // BEAUTY - FRAGRANCE
      // ========================================

      {
        name: "Premium Fragrance",
        description:
          "Long-lasting everyday fragrance with a fresh and sophisticated aroma.",
        price: 1999,
        stock: 45,
        category:
          categories["Fragrance"],
        vendor:
          vendor._id,
        image:
          "/images/perfume.jpg",
        isActive: true
      },


      // ========================================
      // BEAUTY - HAIR CARE
      // ========================================

      {
        name: "Professional Hair Dryer",
        description:
          "Powerful hair dryer with multiple heat and speed settings.",
        price: 2499,
        stock: 30,
        category:
          categories["Hair Care"],
        vendor:
          vendor._id,
        image:
          "/images/hair-dryer.jpg",
        isActive: true
      },


      // ========================================
      // BOOKS - SELF IMPROVEMENT
      // ========================================

      {
        name: "Atomic Habits",
        description:
          "A practical book about building good habits and breaking bad ones.",
        price: 599,
        stock: 60,
        category:
          categories["Self Improvement"],
        vendor:
          vendor._id,
        image:
          "/images/atomic-habits.jpg",
        isActive: true
      },


      // ========================================
      // BOOKS - PROGRAMMING
      // ========================================

      {
        name: "Clean Code",
        description:
          "A practical guide to writing readable, maintainable and professional software.",
        price: 899,
        stock: 35,
        category:
          categories["Programming"],
        vendor:
          vendor._id,
        image:
          "/images/clean-code.jpg",
        isActive: true
      },


      // ========================================
      // BOOKS - BUSINESS
      // ========================================

      {
        name: "Deep Work",
        description:
          "A guide to focused work and building productive habits in a distracted world.",
        price: 499,
        stock: 50,
        category:
          categories["Business"],
        vendor:
          vendor._id,
        image:
          "/images/deep-work.jpg",
        isActive: true
      }
    ];


    // ==========================================
    // INSERT PRODUCTS
    // ==========================================

    let insertedCount = 0;


    for (const product of products) {

      const existingProduct =
        await Product.findOne({
          name: product.name
        });


      // Don't create duplicate product

      if (existingProduct) {

        console.log(
          `Product already exists: ${product.name}`
        );

        continue;
      }


      await Product.create(product);

      insertedCount++;


      console.log(
        `Product created: ${product.name}`
      );
    }


    // ==========================================
    // FINAL RESULT
    // ==========================================

    console.log("");

    console.log(
      `Successfully added ${insertedCount} new products.`
    );

    console.log(
      "Product seeding completed."
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "Product seeding failed:",
      error.message
    );

    process.exit(1);
  }
};


seedProducts();