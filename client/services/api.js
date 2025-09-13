// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:4000/api';

// // Create axios instance with default config
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response interceptor to handle auth errors
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/signIn';
//         }
//         return Promise.reject(error);
//     }
// );

// // Auth API calls
// export const authAPI = {
//     login: (credentials) => api.post('/auth/login', credentials),
//     register: (userData) => api.post('/auth/register', userData),
//     getCurrentUser: () => api.get('/auth/me'),
// };

// // Products API calls
// export const productsAPI = {
//     getAll: () => api.get('/products'),
//     getById: (id) => api.get(`/products/${id}`),
//     create: (productData) => api.post('/products', productData),
//     update: (id, productData) => api.put(`/products/${id}`, productData),
//     delete: (id) => api.delete(`/products/${id}`),
//     getByCategory: (category) => api.get(`/products/category/${category}`),
//     search: (query) => api.get(`/products/search/${query}`),
// };

// // Users API calls
// export const usersAPI = {
//     getAll: () => api.get('/users'),
//     getById: (id) => api.get(`/users/${id}`),
//     update: (id, userData) => api.put(`/users/${id}`, userData),
//     delete: (id) => api.delete(`/users/${id}`),
//     updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
// };

// // Orders API calls
// export const ordersAPI = {
//     getAll: () => api.get('/orders'),
//     getByUserId: (userId) => api.get(`/orders/user/${userId}`),
//     create: (orderData) => api.post('/orders', orderData),
//     update: (id, orderData) => api.put(`/orders/${id}`, orderData),
//     delete: (id) => api.delete(`/orders/${id}`),
// };

// // Custom Requests API calls
// export const customRequestsAPI = {
//     getAll: () => api.get('/orders/custom-requests'),
//     getByUserId: (userId) => api.get(`/orders/custom-requests/user/${userId}`),
//     create: (requestData) => api.post('/orders/custom-requests', requestData),
//     update: (id, requestData) => api.put(`/orders/custom-requests/${id}`, requestData),
//     delete: (id) => api.delete(`/orders/custom-requests/${id}`),
// };

// export default api;
