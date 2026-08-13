const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },

    sku: {
        type: String,
        unique: true
    },

    barcode: { type: String, trim: true, sparse: true },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    description: String,

    purchasePrice: { type: Number, required: true, min: 0 },

    sellingPrice: { type: Number, required: true, min: 0 },

    stock: {
        type: Number,
        default: 0, min: 0
    },

    minimumStock: {
        type: Number,
        default: 5, min: 0
    },

    unit: {
        type: String,
        default: "piece"
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
