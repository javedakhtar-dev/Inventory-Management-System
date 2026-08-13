const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier"
    },

    items: {
      type: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: Number,

            purchasePrice: Number,

            total: Number
        }
      ],
      validate: [(items) => items.length > 0, 'At least one item is required']
    },

    subtotal: { type: Number, required: true, min: 0 },

    discount: { type: Number, default: 0, min: 0 },

    tax: { type: Number, default: 0, min: 0 },

    grandTotal: { type: Number, required: true, min: 0 },

    paymentStatus: {
        type: String,
        enum: ["paid", "partial", "pending"]
    },

    purchaseDate: { type: Date, default: Date.now },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;
