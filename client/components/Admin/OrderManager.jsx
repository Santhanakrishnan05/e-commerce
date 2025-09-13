import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

export default function OrderManager(props) {
  const { user } = useAuth()
  const [orderAdmin, setOrderAdmin] = useState([])
  const [orderRequestAdmin, setOrderRequestAdmin] = useState([])
  const [amountById, setAmountById] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
    fetchCustomRequests()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders')
      setOrderAdmin(response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrderAdmin([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      const ok = window.confirm('Are you sure you want to delete this order?')
      if (!ok) return
      await axios.delete(`http://localhost:4000/api/orders/${orderId}`)
      fetchOrders()
    } catch (error) {
      console.error('Failed to delete order:', error)
      alert('Failed to delete order')
    }
  }

  const fetchCustomRequests = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/orders/custom-requests')
      setOrderRequestAdmin(response.data || [])
    } catch (error) {
      console.error('Error fetching custom requests:', error)
      setOrderRequestAdmin([])
    }
  }

  const handleSetRequest = async (item) => {
    const raw = amountById[item._id] ?? ''
    const numericAmount = Number(raw)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount (> 0)')
      return
    }

    try {
      // Send only the fields that are meant to be updated
      const update = { estimatedCost: numericAmount, status: 'approved' }
      await axios.put(`http://localhost:4000/api/orders/custom-requests/${item._id}`, update)
      // Clear only this row's amount input
      setAmountById(prev => ({ ...prev, [item._id]: '' }))
      // Refresh the data
      fetchCustomRequests()
    } catch (err) {
      console.log(err)
      alert('Failed to update request')
    }
  }

  const [reqStatus, setReqStatus] = useState({})

  // Initialize reqStatus when orderAdmin changes
  useEffect(() => {
    if (Array.isArray(orderAdmin)) {
      const statusMap = Object.fromEntries(
        orderAdmin.map(item => [item._id || item.id, item.status || 'pending'])
      )
      setReqStatus(statusMap)
    }
  }, [orderAdmin])

  const handleChangeStatus = async (newStatus, item) => {
    try {
      setReqStatus(prev => ({ ...prev, [item._id || item.id]: newStatus }))
      const updateStatus = { status: newStatus }
      await axios.put(`http://localhost:4000/api/orders/${item._id || item.id}`, updateStatus)
      fetchOrders() // Refresh the data
    } catch (err) {
      console.log(err)
      alert('Failed to update status')
    }
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="cart-list-admin">
      <div className='title-admin'>
        <h2>Your Order History</h2>
      </div>
      <h2 className='subTitle-admin'>Custom-Order Status</h2>
      <div className='custom-design-admin'>
        {Array.isArray(orderRequestAdmin) && orderRequestAdmin.length > 0 ? (
          orderRequestAdmin.map(item => {
            const inputAmount = amountById[item._id] ?? ''
            return (
              <div className="cart-card-admin" key={item._id || item.id}>
                <h3 className="cart-title-admin">Order Status {item.status}</h3>
                <div className="cart-details-admin">
                  <p><strong>User Id:</strong> {item.userID || item.userId}</p>
                  <p><strong>User name:</strong> {item.username}</p>
                  <p><strong>User email:</strong> {item.email}</p>
                  <p><strong>User Address:</strong> {item.address}</p>
                  <p><strong>Cloth Type:</strong> {item.clothType}</p>
                  <p><strong>Color:</strong> {item.color}</p>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Amount:</strong> {item.estimatedCost }</p>
                  <p><strong>Design:</strong> {item.image ? (
                    <a href={`http://localhost:4000/uploads/${item.image}`} target="_blank" rel="noreferrer">View Design</a>
                  ) : item.designLink ? (
                    <a href={item.designLink} target="_blank" rel="noreferrer">View Design</a>
                  ) : (
                    "No design"
                  )}</p>
                  {item.status !== 'approved' && (
                    <div style={{margin: '10px 0'}}>
                      <label htmlFor={`amount-${item._id}`}><strong>Set Amount:</strong></label>
                      <input
                        id={`amount-${item._id}`}
                        type="number"
                        value={inputAmount}
                        onChange={(e) => setAmountById(prev => ({ ...prev, [item._id]: e.target.value }))}
                        placeholder="Enter estimated cost"
                        min="0"
                        step="0.01"
                        style={{marginLeft: '10px', padding: '5px'}}
                      />
                    </div>
                  )}
                  <button
                    className="custom-order-btn-admin"
                    disabled={(item.status === 'approved')}
                    onClick={() => handleSetRequest(item)}
                  >
                    {item.status === 'approved' ? '✅ Approved' : 'Approve & Set Amount'}
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <p>No custom requests found</p>
        )}
      </div>
      <h2 className='subTitle-admin'>Order Status</h2>
      <div className='custom-design-admin'>
        {Array.isArray(orderAdmin) && orderAdmin.length > 0 ? (
          orderAdmin.map(item => {
            return (
              <div className="cart-card-admin1" key={item._id || item.id}>
                <h3 className="cart-title-admin">Order Status {item.status}</h3>
                <div className="cart-details-admin">
                  <p><strong>Order Type</strong> {item.type}</p>
                  <p><strong>User ID</strong> {item.userId}</p>
                  <p><strong>User Name:</strong> {item.username}</p>
                  <p><strong>User Email:</strong> {item.email}</p>
                  <p><strong>User Adderss:</strong> {item.address}</p>

                  <p><strong>Product ID:</strong> {item.productId}</p>
                  <p><strong>Product Name:</strong> {item.clothType}</p>
                  <p><strong>Price:</strong> {item.amount}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Color:</strong> {item.color}</p>
                  <p><strong>Design:</strong> {item.image ? (
                    <a href={`http://localhost:4000/uploads/${item.image}`} target="_blank" rel="noreferrer">View Design</a>
                  ) : item.designLink ? (
                    <a href={item.designLink} target="_blank" rel="noreferrer">View Design</a>
                  ) : (
                    "No design"
                  )}</p>
                  <p><strong>Payment:</strong> {item.payment}</p>
                  <p><strong>Payment ID:</strong> {item.paymentId}</p>
                  <div className='status'>
                    <label htmlFor=""><strong>Status :</strong></label>

                    <label htmlFor="1">Accepted </label>
                    <input type="radio" value={'Accepted'} checked={reqStatus[item._id || item.id] === 'Accepted'} onChange={() => handleChangeStatus('Accepted', item)} />

                    <label htmlFor="2"> Delivering </label>
                    <input type="radio" value={'Delivering'} checked={reqStatus[item._id || item.id] === 'Delivering'} onChange={() => handleChangeStatus('Delivering', item)} />

                    <label htmlFor="3">  Delivered </label>
                    <input type="radio" value={'Delivered'} checked={reqStatus[item._id || item.id] === 'Delivered'} onChange={() => handleChangeStatus('Delivered', item)} />
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <button
                      style={{background:'#e74c3c', color:'#fff', padding:'6px 10px', border:'none', borderRadius:'4px', cursor:'pointer'}}
                      onClick={() => handleDeleteOrder(item._id || item.id)}
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  )
}
