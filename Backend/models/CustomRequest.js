const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
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
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'],
        default: 'pending'
    },
    type: {
        type: String,
        default: 'customize'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    estimatedCost: {
        type: Number,
        min: 0
    },
    estimatedTime: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for better query performance
customRequestSchema.index({ userId: 1, createdAt: -1 });
customRequestSchema.index({ status: 1 });

module.exports = mongoose.model('CustomRequest', customRequestSchema);
