import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminDashboard(props) {
  const { products } = useAuth()
  const navigate = useNavigate()
  const [orderAdmin, setOrderAdmin] = useState([])
  const [orderRequestAdmin, setOrderRequestAdmin] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    fetchOrders()
    fetchCustomRequests()
    fetchUsers()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders')
      setOrderAdmin(response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrderAdmin([])
    }
  }

  const fetchCustomRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders/custom-requests')
      setOrderRequestAdmin(response.data || [])
    } catch (error) {
      console.error('Error fetching custom requests:', error)
      setOrderRequestAdmin([])
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users')
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate total earnings safely
  const totalEarnings = Array.isArray(orderAdmin) 
    ? orderAdmin.reduce((sum, item) => sum + parseInt(item.amount || 0), 0)
    : 0

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="summary-cards">
        <button onClick={() => navigate("/products")} className="card">
          <h2>🛒 Products</h2>
          <p>{Array.isArray(products) ? products.length : 0}</p>
        </button>
        <button onClick={() => navigate("/user-manager")} className="card">
          <h2>👤 Users</h2>
          <p>{Array.isArray(users) ? users.length : 0}</p>
        </button>
        <button onClick={() => navigate("/order-manager")} className="card">
          <h2>📦 Orders</h2>
          <p>{Array.isArray(orderAdmin) ? orderAdmin.length : 0}</p>
        </button>
        <button className="card">
          <h2>💰 Earnings</h2>
          <p>₹{totalEarnings}</p>
        </button>
        <button onClick={() => navigate("/order-manager")} className="card">
          <h2>📬 Requests</h2>
          <p>{Array.isArray(orderRequestAdmin) ? orderRequestAdmin.length : 0}</p>
        </button>
      </div>
    </div>
  )
}
