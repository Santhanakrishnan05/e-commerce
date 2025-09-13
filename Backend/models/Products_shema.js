const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discountPrice: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    size: [{
        type: String,
        required: true
    }],
    colorsAvailable: [{
        type: String,
        required: true
    }],
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    designLink: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better query performance
productSchema.index({ name: 'text', description: 'text', category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);