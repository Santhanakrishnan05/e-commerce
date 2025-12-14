# E-Commerce Project

A full-stack e-commerce application built with React frontend and Spring Boot backend with MySQL database.

## Features

### User Features
- User registration and authentication (JWT based)
- Product browsing and search
- Shopping cart management
- Favorites / wishlist
- Custom design requests
- Order history (normal & customized)
- User profile management

### Admin Features
- Product management (Create, Update, Delete)
- User management
- Order management
- Custom design request approval & pricing
- Admin dashboard

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Context API for state management
- CSS for styling

### Backend
- Java Spring Boot
- Spring Web (REST APIs)
- Spring Data JPA
- Spring Security (JWT Authentication)
- MySQL Database
- Hibernate ORM
- Multipart file upload

---

## 📁 Project Structure

```
e-commerce/
├── client/                      # React frontend
│   ├── components/              # Reusable UI components
│   ├── context/                 # Context providers (Auth, Cart)
│   ├── pages/                   # Pages (Home, Orders, Admin, etc.)
│   ├── styles/                  # CSS files
│   └── main.jsx                 # App entry point
│
└── E-CommerceBackEnd/           # Spring Boot backend
    ├── config/                  # Security & Web config
    ├── controller/              # REST controllers
    ├── dto/                     # Request & Response DTOs
    ├── model/                   # JPA entities
    ├── repository/              # JPA repositories
    ├── service/                 # Business logic
    ├── uploads/                 # Uploaded images
    └── application.properties   # Backend configuration
```

## ⚙️ Setup Instructions

### ✅ Prerequisites
- Java 17 or higher
- Maven
- MySQL (running locally)
- Node.js (v16+)
- Git

### 🔧 Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd E-CommerceBackEnd
   ```
2. Configure `application.properties`:

   ```properties
   server.port=8080

   spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

   jwt.secret=your-super-secret-jwt-key

   ```
3. Create the database in `MySQL`:

``` `SQL`
CREATE DATABASE ecommerce_db;```

4. Run the Spring Boot application:

``` `Bash`
mvn spring-boot:run```
✅ Backend runs at: http://localhost:8080

## 🎨 Frontend Setup (React)
### Navigate to the frontend directory:

``` `Bash`
cd client```

### Install dependencies:

``` `Bash`
npm install ```

### Start the development server:

``` `Bash`
npm run dev ```
✅ Frontend runs at: http://localhost:5173

## 🔗 API Endpoints

### 🔐 Authentication
- `POST /auth/register` – Register user
- `POST /auth/login` – Login user
- `GET /auth/me` – Get logged-in user

### 📦 Products
- `GET /products` – Get all products
- `GET /products/{id}` – Get product by ID
- `POST /products` – Create product (admin)
- `PUT /products/{id}` – Update product (admin)
- `DELETE /products/{id}` – Delete product (admin)

### 👥 Users
- `GET /users` – Get all users (admin)
- `GET /users/{id}` – Get user by ID
- `PUT /users/{id}` – Update user profile
- `DELETE /users/{id}` – Delete user (admin)

### 🧾 Orders
- `GET /orders` – Get all orders (admin)
- `GET /orders/user/{userId}` – Get user orders
- `POST /orders` – Create new order
- `PUT /orders/{id}` – Update order status

### 🎨 Custom Design Requests
- `GET /orders/custom-requests` – Get all custom requests (admin)
- `GET /orders/custom-requests/user/{userId}` – Get user custom requests
- `POST /orders/custom-requests` – Create custom request
- `PUT /orders/custom-requests/{id}` – Update custom request (admin)

## 🗄️ Database Models (JPA Entities)

### User
- `id`, `userName`, `email`, `password`, `address`, `role`, `joinedAt`

### Product
- `id`, `name`, `originalPrice`, `discountPrice`, `category`, `description`, `size`, `colorsAvailable`, `quantity`, `image`, `createdAt`

### Order
- `id`, `productId`, `userId`, `userName`, `email`, `address`, `clothType`, `color`, `size`, `quantity`, `amount`, `payment`, `status`, `type`, `createdAt`

### CustomRequest
- `id`, `userId`, `image`, `color`, `size`, `quantity`, `status`, `type`, `estimatedCost`, `createdAt`

## ▶️ Usage

1. Start MySQL, Backend, and Frontend.
2. Open `http://localhost:5173`.
3. Register or login.
4. Browse products and place orders.
5. Submit custom design requests.
6. Admin can approve & set price for custom requests.
7. User converts approved custom request into an order.

## 👑 Admin Access

To make a user admin, run the following SQL command:

``` `sql`
UPDATE users SET role = 'admin' WHERE id = 1; ```

## 🤝 Contributing
- Fork the repository

- Create a new branch

- Make changes

- Submit a pull request

## 📜 License
- This project is open-source and available under the MIT License.


   
