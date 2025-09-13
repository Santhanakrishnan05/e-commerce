const express = require('express');
const router = express.Router();
const Product = require('../models/Products_shema');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('Create product request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const productData = req.body;
        
        if (req.file) {
            productData.image = req.file.filename;
            console.log('File uploaded:', req.file.filename);
        } else {
            console.log('No file uploaded');
        }

        // Parse arrays from comma-separated strings
        if (productData.size) {
            productData.size = productData.size.split(',').map(s => s.trim());
            console.log('Parsed size:', productData.size);
        }
        if (productData.colorsAvailable) {
            productData.colorsAvailable = productData.colorsAvailable.split(',').map(c => c.trim());
            console.log('Parsed colors:', productData.colorsAvailable);
        }

        console.log('Final product data:', productData);

        const product = new Product(productData);
        await product.save();
        
        console.log('Product saved successfully:', product._id);
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Create product error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.image = req.file.filename;
        }

        // Parse arrays from comma-separated strings
        if (updateData.size) {
            updateData.size = updateData.size.split(',').map(s => s.trim());
        }
        if (updateData.colorsAvailable) {
            updateData.colorsAvailable = updateData.colorsAvailable.split(',').map(c => c.trim());
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search products
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;