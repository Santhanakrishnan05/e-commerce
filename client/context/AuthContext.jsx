import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]); // Always an array
    const [direct, setDirect] = useState(false);
    const [orderFormData, setOrderFormData] = useState({
        clothType: '',
        color: '',
        size: '',
        quantity: 1
    });

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/products');
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    // Check if user is logged in on app start
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true, user };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (username, email, password, address) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:4000/api/auth/register', {
                username,
                email,
                password,
                address
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        // Do NOT clear cart and favorites on logout anymore
        // if (user) {
        //     const userId = user._id || user.userId;
        //     localStorage.removeItem(`cart-${userId}`);
        //     localStorage.removeItem(`favorites-${userId}`);
        // }
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
        setProducts([]); // Also clear products
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleChangeProductData = (e) => {
        const { name, value } = e.target;
        setOrderFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitProduct = async (e, productData) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please login to place an order');
            return;
        }

        // Validate form data
        if (!orderFormData.color || !orderFormData.size || !orderFormData.quantity) {
            alert('Please fill in all required fields (Color, Size, Quantity)');
            return;
        }

        try {
            const orderData = {
                productId: productData._id || productData.id,
                userId: user._id || user.userId,
                username: user.username,
                email: user.email,
                address: user.address || 'Not provided',
                clothType: orderFormData.clothType || productData.name,
                color: orderFormData.color,
                size: orderFormData.size,
                quantity: parseInt(orderFormData.quantity),
                designLink: productData.image
                    ? `http://localhost:4000/uploads/${productData.image.split('/').pop()}`
                    : (productData.designLink || ''),
                image: productData.image ? productData.image.split('/').pop() : '',
                amount: (productData.discountPrice || productData.originalPrice) * parseInt(orderFormData.quantity),
                paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'Product',
                status: 'pending',
                payment: 'paid'
            };

            const response = await axios.post('http://localhost:4000/api/orders', orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.message === 'Order created successfully') {
                alert('Order placed successfully!');
                setDirect(true); // This will trigger navigation to order history
                // Reset form
                setOrderFormData({
                    clothType: '',
                    color: '',
                    size: '',
                    quantity: 1
                });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        checkAuthStatus,
        products,
        setProducts,
        direct,
        setDirect,
        orderFormData,
        setOrderFormData,
        handleChangeProductData,
        handleSubmitProduct
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
