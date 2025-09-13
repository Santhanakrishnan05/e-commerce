const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'paid',
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    clothType: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    designLink: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['Product', 'customize'],
        required: true
    },
    trackingNumber: {
        type: String,
        default: ''
    },
    estimatedDelivery: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ payment: 1 });

module.exports = mongoose.model('Order', orderSchema);
