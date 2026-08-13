const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    phone: String,

    email: String,

    address: String,
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
