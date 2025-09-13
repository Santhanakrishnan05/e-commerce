const mongoose = require('mongoose');
const Product = require('./models/Products_shema');
require('dotenv').config({ path: './config.env' });

// Sample products data
const sampleProducts = [
    {
        name: "Men's Classic T-Shirt",
        originalPrice: 899,
        discountPrice: 599,
        image: "sample-tshirt.jpg",
        category: "Men",
        description: "Comfortable cotton t-shirt perfect for everyday wear",
        size: ["S", "M", "L", "XL"],
        colorsAvailable: ["Black", "White", "Navy"],
        quantity: 50,
        designLink: "https://example.com/design1.jpg"
    },
    {
        name: "Women's Summer Dress",
        originalPrice: 1299,
        discountPrice: 899,
        image: "sample-dress.jpg",
        category: "Women",
        description: "Light and breezy summer dress with floral pattern",
        size: ["XS", "S", "M", "L"],
        colorsAvailable: ["Blue", "Pink", "Yellow"],
        quantity: 30,
        designLink: "https://example.com/design2.jpg"
    },
    {
        name: "Kids Casual Shirt",
        originalPrice: 599,
        discountPrice: 399,
        image: "sample-kids.jpg",
        category: "Kids",
        description: "Comfortable and stylish shirt for children",
        size: ["2T", "3T", "4T", "5T"],
        colorsAvailable: ["Red", "Blue", "Green"],
        quantity: 40,
        designLink: "https://example.com/design3.jpg"
    }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert sample products
        const result = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${result.length} sample products`);
        
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
