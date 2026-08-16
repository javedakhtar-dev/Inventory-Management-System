const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    companyName: String,

    phone: String,

    email: String,

    address: String,

    gstNumber: String,

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const Supplier = mongoose.model("Supplier", SupplierSchema);

module.exports = Supplier;
