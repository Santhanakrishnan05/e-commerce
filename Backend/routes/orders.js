const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const CustomRequest = require('../models/CustomRequest');
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

// Get all orders (admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        const order = new Order(orderData);
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Custom Request Routes
// Get all custom requests (admin)
router.get('/custom-requests', async (req, res) => {
    try {
        const requests = await CustomRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Get custom requests error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user custom requests
router.get('/custom-requests/user/:userId', async (req, res) => {
    try {
        const requests = await CustomRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Get user custom requests error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create custom request
router.post('/custom-requests', upload.single('image'), async (req, res) => {
    try {
        console.log('Create custom request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        const requestData = req.body;
        
        if (req.file) {
            requestData.image = req.file.filename;
            console.log('File uploaded:', req.file.filename);
        } else {
            console.log('No file uploaded');
            return res.status(400).json({ error: 'Image file is required' });
        }

        // Convert quantity to number
        if (requestData.quantity) {
            requestData.quantity = parseInt(requestData.quantity);
        }

        console.log('Final request data:', requestData);

        const request = new CustomRequest(requestData);
        await request.save();
        
        console.log('Custom request saved successfully:', request._id);
        res.status(201).json({ message: 'Custom request created successfully', request });
    } catch (error) {
        console.error('Create custom request error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update custom request status
router.put('/custom-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, estimatedCost, adminNotes, estimatedTime } = req.body;
        
        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;
        
        const request = await CustomRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!request) {
            return res.status(404).json({ error: 'Custom request not found' });
        }
        
        res.json({ message: 'Custom request updated successfully', request });
    } catch (error) {
        console.error('Update custom request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete custom request
router.delete('/custom-requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const request = await CustomRequest.findByIdAndDelete(id);
        
        if (!request) {
            return res.status(404).json({ error: 'Custom request not found' });
        }
        
        res.json({ message: 'Custom request deleted successfully' });
    } catch (error) {
        console.error('Delete custom request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
