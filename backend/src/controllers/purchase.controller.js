const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const StockTransaction = require("../models/StockTransaction");

const createPurchases = async (req, res, next) => {
  try {
    const {
      supplier,
      items,
      discount = 0,
      tax = 0,
      paymentStatus = "paid",
      purchaseDate,
    } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res
        .status(400)
        .json({
          success: false,
          message: "At least one purchase item is required.",
        });
    if (supplier && !(await Supplier.exists({ _id: supplier })))
      return res
        .status(400)
        .json({ success: false, message: "Supplier not found." });
    const normalized = [];
    for (const item of items) {
      if (
        !item.product ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        !Number.isFinite(Number(item.purchasePrice)) ||
        Number(item.purchasePrice) < 0
      )
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Each item needs a product, positive quantity and valid purchase price.",
          });
      const product = await Product.findById(item.product);
      if (!product)
        return res
          .status(400)
          .json({
            success: false,
            message: "A selected product was not found.",
          });
      normalized.push({
        product,
        quantity: Number(item.quantity),
        purchasePrice: Number(item.purchasePrice),
        total: Number(item.quantity) * Number(item.purchasePrice),
      });
    }
    const subtotal = normalized.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = Math.max(
      0,
      subtotal - Number(discount || 0) + Number(tax || 0),
    );
    const purchase = await Purchase.create({
      supplier: supplier || undefined,
      items: normalized.map(({ product, quantity, purchasePrice, total }) => ({
        product: product._id,
        quantity,
        purchasePrice,
        total,
      })),
      subtotal,
      discount,
      tax,
      grandTotal,
      paymentStatus,
      purchaseDate,
      createdBy: req.userId,
    });
    for (const item of normalized) {
      const previousStock = item.product.stock;
      item.product.stock += item.quantity;
      item.product.purchasePrice = item.purchasePrice;
      await item.product.save();
      await StockTransaction.create({
        product: item.product._id,
        type: "purchase",
        quantity: item.quantity,
        previousStock,
        newStock: item.product.stock,
        referenceId: purchase._id,
        createdBy: req.userId,
      });
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "Purchase created and stock updated.",
        data: { purchase },
      });
  } catch (error) {
    next(error);
  }
};
const purchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier", "name companyName")
      .populate("items.product", "name sku")
      .populate("createdBy", "name")
      .sort({ purchaseDate: -1 });
    res.json({ success: true, data: { purchases } });
  } catch (error) {
    next(error);
  }
};
const purchaseId = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name companyName")
      .populate("items.product", "name sku")
      .populate("createdBy", "name");
    if (!purchase)
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found." });
    res.json({ success: true, data: { purchase } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchases,
  purchases,
  purchaseId,
};
