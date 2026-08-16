const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");

const history = async (req, res, next) => {
  try {
    const filter = req.query.product ? { product: req.query.product } : {};
    const transactions = await StockTransaction.find(filter)
      .populate("product", "name sku")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 100);
    res.json({ success: true, data: { transactions } });
  } catch (error) {
    next(error);
  }
};

const adjustStock = async (req, res, next) => {
  try {
    const { product: productId, quantity, note = "" } = req.body;
    const change = Number(quantity);
    if (!productId || !Number.isFinite(change) || change === 0)
      return res
        .status(400)
        .json({
          success: false,
          message: "Product and a non-zero quantity are required.",
        });
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    if (product.stock + change < 0)
      return res
        .status(400)
        .json({
          success: false,
          message: "Adjustment would make stock negative.",
        });
    const previousStock = product.stock;
    product.stock += change;
    await product.save();
    const transaction = await StockTransaction.create({
      product: product._id,
      type: "adjustment",
      quantity: change,
      previousStock,
      newStock: product.stock,
      note,
      createdBy: req.userId,
    });
    res.json({
      success: true,
      message: "Stock adjusted.",
      data: { product, transaction },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { history, adjustStock };
