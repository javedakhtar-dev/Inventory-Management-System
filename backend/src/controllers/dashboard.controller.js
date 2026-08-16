const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");

const dashboard = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const [
      productCount,
      lowStockProducts,
      todaySales,
      todayPurchases,
      recentSales,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.find({
        isActive: true,
        $expr: { $lte: ["$stock", "$minimumStock"] },
      })
        .select("name sku stock minimumStock")
        .sort({ stock: 1 })
        .limit(10),
      Sale.aggregate([
        { $match: { saleDate: { $gte: start } } },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandTotal" },
            count: { $sum: 1 },
          },
        },
      ]),
      Purchase.aggregate([
        { $match: { purchaseDate: { $gte: start } } },
        {
          $group: {
            _id: null,
            total: { $sum: "$grandTotal" },
            count: { $sum: 1 },
          },
        },
      ]),
      Sale.find().populate("customer", "name").sort({ saleDate: -1 }).limit(5),
    ]);
    return res.json({
      success: true,
      data: {
        productCount,
        lowStockProducts,
        todaySales: todaySales[0] || { total: 0, count: 0 },
        todayPurchases: todayPurchases[0] || { total: 0, count: 0 },
        recentSales,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = dashboard;
