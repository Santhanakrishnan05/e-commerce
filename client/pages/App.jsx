import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../components/User/Home'
import '../styles/user.css'
import '../styles/App.css'
import '../styles/Auth.css'
import '../styles/index.css'
import '../styles/Admin.css'
import axios from 'axios'
import SignIn from '../Auth/SignIn'
import Profile from '../components/User/Profile'
import SignUp from '../Auth/SignUp'
import Cart from '../components/User/Cart'
import Favourites from '../components/User/Favourites'
import AdminDashboard from '../components/Admin/AdminDashboard'
import AdminProfile from '../components/Admin/AdminProfile'
import ProductManager from '../components/Admin/ProductManager'
import CustomizeDesign from '../components/User/CustomizeDesign'
import OrderHistory from '../components/User/OrderHistory'
import UserManager from '../components/Admin/UserManager'
import OrderManager from '../components/Admin/OrderManager'
import ProductCheck from '../components/User/ProductCheck'
import AddProduct from '../components/Admin/addProducts'
import UpdateProduct from '../components/Admin/updateProduct'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:4000/api';

function App() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orderRequest, setOrderRequest] = useState([])
  const [orderProduct, setOrderProduct] = useState([])
  const [orderRequestAdmin, setOrderRequestAdmin] = useState([])
  const [orderAdmin, setOrderAdmin] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch users (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch orders and custom requests
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch custom requests
          const requestsResponse = await axios.get('/orders/custom-requests', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrderRequestAdmin(requestsResponse.data);

          // Fetch orders
          const ordersResponse = await axios.get('/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrderAdmin(ordersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCustomRequest = async (requestData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to submit custom requests');
        return;
      }

      const response = await axios.post('/orders/custom-requests', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Custom request submitted successfully!');
      // Refresh orders
      const requestsResponse = await axios.get('/orders/custom-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderRequestAdmin(requestsResponse.data);
    } catch (error) {
      console.error('Error submitting custom request:', error);
      setMessage('Failed to submit custom request');
    }
  };

  const handleProductOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to place orders');
        return;
      }

      const response = await axios.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Order placed successfully!');
      // Refresh orders
      const ordersResponse = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderAdmin(ordersResponse.data);
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Failed to place order');
    }
  };

  const handleProductUpdate = async (productId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to update products');
        return;
      }

      const response = await axios.put(`/products/${productId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Product updated successfully!');
      // Refresh products
      const productsResponse = await axios.get('/products');
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Failed to update product');
    }
  };

  const handleUserUpdate = async (userId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to update profile');
        return;
      }

      const response = await axios.put(`/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Profile updated successfully!');
      // Refresh users
      const usersResponse = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className='App'>
      <AuthProvider>
        <CartProvider>
      <BrowserRouter>
            <NavBar />
        <Routes>
              <Route path='/' element={<Home products={products} />} />
          <Route path='/product-checkout' element={<ProductCheck />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/favourite' element={<Favourites />} />
              <Route path='/profile' element={
                <Profile 
                  onUpdate={handleUserUpdate}
                  message={message}
                  setMessage={setMessage}
                />
              } />
              <Route path='/customize' element={
                <CustomizeDesign 
                  onSubmit={handleCustomRequest}
                  message={message}
                  setMessage={setMessage}
                />
              } />
          <Route path='/order-history' element={<OrderHistory />} />
              <Route path='/admin-profile' element={
                <AdminProfile 
                  onUpdate={handleUserUpdate}
                  message={message}
                  setMessage={setMessage}
                />
              } />
              <Route path='/products' element={
                <ProductManager 
                  products={products}
                  onUpdate={handleProductUpdate}
                  message={message}
                  setMessage={setMessage}
                />
              } />
          <Route path='addProducts' element={<AddProduct />} />
          <Route path='updateProduct' element={<UpdateProduct />} />
              <Route path='/dashBoard' element={
                <AdminDashboard
            orderRequestAdmin={orderRequestAdmin}
            orderAdmin={orderAdmin}
                  loading={loading}
                />
              } />
              <Route path='/user-manager' element={
                <UserManager 
                  users={users}
                  onUpdate={handleUserUpdate}
                  message={message}
                  setMessage={setMessage}
                />
              } />
              <Route path='/order-manager' element={
                <OrderManager
                  orderRequestAdmin={orderRequestAdmin}
            setOrderRequestAdmin={setOrderRequestAdmin}
                  orderAdmin={orderAdmin}
                  setOrderAdmin={setOrderAdmin}
                  message={message}
                  setMessage={setMessage}
                />
              } />
        </Routes>
      </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  )
}

export default App
