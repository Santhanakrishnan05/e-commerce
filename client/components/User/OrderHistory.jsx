import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

export default function OrderHistory() {
  const { user } = useAuth()
  const [orderRequest, setOrderRequest] = useState([])
  const [orderProduct, setOrderProduct] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch orders on component mount
  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  // Refresh orders every 30 seconds to get updated amounts
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchOrders()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [user])

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      }
      
      // Fetch custom design requests for current user
      const customResponse = await axios.get(`http://localhost:4000/api/orders/custom-requests/user/${user._id || user.userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setOrderRequest(customResponse.data || [])

      // Fetch regular orders for current user
      const ordersResponse = await axios.get(`http://localhost:4000/api/orders/user/${user._id || user.userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setOrderProduct(ordersResponse.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrderRequest([])
      setOrderProduct([])
    } finally {
      setLoading(false)
      if (isRefresh) {
        setRefreshing(false)
      }
    }
  }

  const handleTransferProduct = async (item) => {
    try {
      if (!user) {
        alert('Please login to place an order');
        return;
      }

      // Validate required fields
      if (!item.estimatedCost || item.estimatedCost <= 0) {
        alert('Cannot place order: Amount not set by admin yet. Please wait for admin to set the price.');
        return;
      }

      // Create order data from custom request
      const orderData = {
        productId: `CUSTOM_${item._id}`, // Custom ID for custom requests
        userId: user._id || user.userId,
        username: user.username,
        email: user.email,
        address: user.address || 'Not provided',
        clothType: item.clothType,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        designLink: item.designLink,
        amount: item.estimatedCost, // Use estimatedCost from custom request
        paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'customize',
        status: 'pending',
        payment: 'paid'
      };

      console.log('Creating order with data:', orderData);

      const response = await axios.post('http://localhost:4000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.message === 'Order created successfully') {
        alert('Order placed successfully! Your custom design is now in production.');
        // Refresh the orders to show the new order
        fetchOrders();
      }
    } catch (error) {
      console.error('Error transferring product:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.error) {
        alert(`Failed to place order: ${error.response.data.error}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    }
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  if (!user) {
    return <div>Please login to view your order history</div>
  }

  return (
    <div className="cart-list">
      <div className='title'>
        <h2>Your Order History</h2>
        {/* <button 
          onClick={() => fetchOrders(true)} 
          className='refresh-btn' 
          style={{marginLeft: '10px', padding: '5px 10px'}}
          disabled={refreshing}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button> */}
      </div>
      
      <h2 className='subTitle'>Your Custom-Order Status</h2>
      <div className='custom-design'>
        {Array.isArray(orderRequest) && orderRequest.length > 0 ? (
          orderRequest.map(item => {
            const isStatus = item.status === "approved"
            // Check if an order has already been placed for this custom request
            const hasOrderPlaced = orderProduct.some(order => 
              order.productId === `CUSTOM_${item._id}` && order.type === 'customize'
            )
            return (
              <div className="cart-card" key={item._id || item.id}>
                <h3 className="cart-title">Order Status {item.status}</h3>
                <div className="cart-details">
                  <p><strong>Cloth Type:</strong> {item.clothType}</p>
                  <p><strong>Color:</strong> {item.color}</p>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Amount:</strong> {item.estimatedCost || 'Not set'}</p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Design:</strong> {item.image ? (
                    <a href={`http://localhost:4000/uploads/${item.image}`} target="_blank" rel="noreferrer">View Design</a>
                  ) : item.designLink ? (
                    <a href={item.designLink} target="_blank" rel="noreferrer">View Design</a>
                  ) : (
                    "No design"
                  )}</p>
                  {item.adminNotes && <p><strong>Admin Notes:</strong> {item.adminNotes}</p>}
                  {item.estimatedTime && <p><strong>Estimated Time:</strong> {item.estimatedTime}</p>}
                  <button 
                    disabled={!isStatus || hasOrderPlaced} 
                    onClick={() => handleTransferProduct(item)} 
                    className='custom-order-btn'
                  >
                    {hasOrderPlaced ? "✅ Order Placed" : isStatus ? "🛒 Buy Now" : "⏳ Awaiting for Approval"}
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <p>No custom orders found</p>
        )}
      </div>

      <h2 className='subTitle'>Your Order Status</h2>
      <div className='custom-design'>
        {Array.isArray(orderProduct) && orderProduct.length > 0 ? (
          orderProduct.map(item => (
            <div className="cart-card" key={item._id || item.id}>
              <h3 className="cart-title">Order Status {item.status}</h3>
              <div className="cart-details">
                <p><strong>Cloth Type:</strong> {item.clothType}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Amount:</strong> {item.amount}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Design:</strong> {item.image ? (
                  <a href={`http://localhost:4000/uploads/${item.image}`} target="_blank" rel="noreferrer">View Design</a>
                ) : item.designLink ? (
                  <a href={item.designLink} target="_blank" rel="noreferrer">View Design</a>
                ) : (
                  "No design"
                )}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  )
}
