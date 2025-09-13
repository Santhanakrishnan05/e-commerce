# E-Commerce Project

A full-stack e-commerce application built with React frontend and Node.js/Express backend with MongoDB database.

## Features

### User Features
- User registration and authentication
- Product browsing and search
- Shopping cart management
- Favorites/wishlist
- Custom design requests
- Order history
- User profile management

### Admin Features
- Product management (CRUD operations)
- User management
- Order management
- Custom request management
- Admin dashboard

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Context API for state management
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Bcrypt for password hashing

## Project Structure

```
e-commerce/
├── client/                 # React frontend
│   ├── components/        # React components
│   ├── context/          # Context providers
│   ├── Auth/             # Authentication components
│   ├── styles/           # CSS files
│   └── pages/            # Main app component
├── Backend/              # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   └── config.env        # Environment variables
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running locally
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following content:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/e-commerce-data
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. Start MongoDB service on your machine

5. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Custom Requests
- `GET /api/orders/custom-requests` - Get all custom requests (admin)
- `GET /api/orders/custom-requests/user/:userId` - Get user custom requests
- `POST /api/orders/custom-requests` - Create custom request
- `PUT /api/orders/custom-requests/:id` - Update custom request status

## Database Models

### User
- username, email, password, address, role, isActive

### Product
- name, originalPrice, discountPrice, image, category, description, size, colorsAvailable, quantity, designLink

### Order
- productId, payment, userId, username, email, address, clothType, color, size, quantity, amount, status, type

### CustomRequest
- userId, username, email, address, clothType, color, size, quantity, designLink, status

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Register a new account or login
4. Browse products, add to cart, and place orders
5. For admin access, change user role to 'admin' in the database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
