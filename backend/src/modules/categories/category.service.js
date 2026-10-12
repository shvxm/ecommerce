const Category = require("./category.model");

const createCategory = async ({ name, description }) => {
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    description
  });

  return category;
};

const getCategories = async () => {
  const categories = await Category.find().sort({
    createdAt: -1
  });

  return categories;
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (categoryId, data) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (data.name && data.name !== category.name) {
    const existingCategory = await Category.findOne({
      name: data.name,
      _id: { $ne: categoryId }
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }
  }

  Object.assign(category, data);

  await category.save();

  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  await category.deleteOne();

  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};