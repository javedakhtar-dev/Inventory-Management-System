const Product = require("../models/Product");
const Category = require("../models/Category");
const generateSKU = require("../utils/generateSKU");

const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      barcode,
      category,
      description,
      purchasePrice,
      sellingPrice,
      stock = 0,
      minimumStock = 5,
      unit = "piece",
      isActive,
    } = req.body;
    if (!name || purchasePrice === undefined || sellingPrice === undefined)
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, purchase price and selling price are required.",
        });
    if (category && !(await Category.exists({ _id: category })))
      return res
        .status(400)
        .json({ success: false, message: "Category not found." });
    let sku;
    do {
      sku = generateSKU(name);
    } while (await Product.exists({ sku }));
    const product = await Product.create({
      name,
      sku,
      barcode,
      category: category || undefined,
      description,
      purchasePrice,
      sellingPrice,
      stock,
      minimumStock,
      unit,
      isActive,
    });
    return res
      .status(201)
      .json({ success: true, message: "Product created.", data: { product } });
  } catch (error) {
    next(error);
  }
};
const getProduct = async (req, res) => {
  try {
    const { search, category, lowStock, active } = req.query;
    const filter = {};
    if (search)
      filter.$or = ["name", "sku", "barcode"].map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    if (category) filter.category = category;
    if (active !== "all") filter.isActive = active !== "false";
    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    const filtered =
      lowStock === "true"
        ? products.filter((product) => product.stock <= product.minimumStock)
        : products;
    return res.json({ success: true, data: { products: filtered } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getProductWithId = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    return res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const { stock, ...updates } = req.body;
    if (stock !== undefined)
      return res
        .status(400)
        .json({
          success: false,
          message: "Use stock adjustment endpoint to change inventory.",
        });
    if (updates.category && !(await Category.exists({ _id: updates.category })))
      return res
        .status(400)
        .json({ success: false, message: "Category not found." });
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    return res.json({
      success: true,
      message: "Product updated.",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    return res.json({ success: true, message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProductWithId,
  updateProduct,
  deleteProduct,
};
