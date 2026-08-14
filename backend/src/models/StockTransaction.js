const mongoose = require("mongoose");

const StockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    type: {
      type: String,
      enum: ["purchase", "sale", "adjustment", "return"],
    },

    quantity: Number,

    previousStock: Number,

    newStock: Number,

    referenceId: mongoose.Schema.Types.ObjectId,

    note: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const StockTransaction = mongoose.model(
  "StockTransaction",
  StockTransactionSchema,
);

module.exports = StockTransaction;
