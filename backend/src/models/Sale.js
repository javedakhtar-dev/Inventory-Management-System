const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },

          quantity: Number,

          sellingPrice: Number,

          total: Number,
        },
      ],
      validate: [(items) => items.length > 0, "At least one item is required"],
    },

    subtotal: { type: Number, required: true, min: 0 },

    discount: { type: Number, default: 0, min: 0 },

    tax: { type: Number, default: 0, min: 0 },

    grandTotal: { type: Number, required: true, min: 0 },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank"],
    },

    saleDate: { type: Date, default: Date.now },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
