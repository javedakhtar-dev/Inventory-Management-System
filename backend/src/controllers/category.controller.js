const Category = require("../models/Category");

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return res
      .status(201)
      .json({
        success: true,
        message: "Category created.",
        data: { category },
      });
  } catch (error) {
    next(error);
  }
};

const categories = async (req, res, next) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ name: 1 });
    return res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

const categoryId = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    return res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    return res.json({
      success: true,
      message: "Category updated.",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    return res.json({ success: true, message: "Category deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  categories,
  categoryId,
  updateCategory,
  deleteCategory,
};
