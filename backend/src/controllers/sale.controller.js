const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const StockTransaction = require("../models/StockTransaction");
const createSale = async (req, res, next) => {
  try {
    const {
      customer,
      items,
      discount = 0,
      tax = 0,
      paymentMethod = "cash",
      saleDate,
    } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res
        .status(400)
        .json({
          success: false,
          message: "At least one sale item is required.",
        });
    if (customer && !(await Customer.exists({ _id: customer })))
      return res
        .status(400)
        .json({ success: false, message: "Customer not found." });
    const normalized = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.product || !Number.isFinite(quantity) || quantity <= 0)
        return res
          .status(400)
          .json({
            success: false,
            message: "Each item needs a product and positive quantity.",
          });
      const product = await Product.findById(item.product);
      if (!product || !product.isActive)
        return res
          .status(400)
          .json({
            success: false,
            message: "A selected active product was not found.",
          });
      if (product.stock < quantity)
        return res
          .status(400)
          .json({
            success: false,
            message: `Insufficient stock for ${product.name}.`,
          });
      const sellingPrice =
        item.sellingPrice === undefined
          ? product.sellingPrice
          : Number(item.sellingPrice);
      if (!Number.isFinite(sellingPrice) || sellingPrice < 0)
        return res
          .status(400)
          .json({ success: false, message: "Selling price must be valid." });
      normalized.push({
        product,
        quantity,
        sellingPrice,
        total: quantity * sellingPrice,
      });
    }
    const subtotal = normalized.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = Math.max(
      0,
      subtotal - Number(discount || 0) + Number(tax || 0),
    );
    const sale = await Sale.create({
      customer: customer || undefined,
      items: normalized.map(({ product, quantity, sellingPrice, total }) => ({
        product: product._id,
        quantity,
        sellingPrice,
        total,
      })),
      subtotal,
      discount,
      tax,
      grandTotal,
      paymentMethod,
      saleDate,
      createdBy: req.userId,
    });
    for (const item of normalized) {
      const previousStock = item.product.stock;
      item.product.stock -= item.quantity;
      await item.product.save();
      await StockTransaction.create({
        product: item.product._id,
        type: "sale",
        quantity: -item.quantity,
        previousStock,
        newStock: item.product.stock,
        referenceId: sale._id,
        createdBy: req.userId,
      });
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "Sale created and stock updated.",
        data: { sale },
      });
  } catch (error) {
    next(error);
  }
};

const sales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name phone")
      .populate("items.product", "name sku")
      .populate("createdBy", "name")
      .sort({ saleDate: -1 });
    res.json({ success: true, data: { sales } });
  } catch (error) {
    next(error);
  }
};

const saleId = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer", "name phone")
      .populate("items.product", "name sku")
      .populate("createdBy", "name");
    if (!sale)
      return res
        .status(404)
        .json({ success: false, message: "Sale not found." });
    res.json({ success: true, data: { sale } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSale,
  sales,
  saleId,
};
