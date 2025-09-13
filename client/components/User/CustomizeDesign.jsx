import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CustomizeDesign() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [customData, setCustomData] = useState({
    clothType: '',
    color: '',
    size: '',
    quantity: ''
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChangeData = (e) => {
    const { name, value } = e.target
    setCustomData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setMessage('Please login to submit a custom request')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const requestData = new FormData()
      requestData.append('image', file)
      requestData.append('clothType', customData.clothType)
      requestData.append('color', customData.color)
      requestData.append('size', customData.size)
      requestData.append('quantity', customData.quantity)
      requestData.append('userId', user._id || user.userId)
      requestData.append('username', user.username)
      requestData.append('email', user.email)
      requestData.append('address', user.address)
      requestData.append('status', 'pending')
      requestData.append('amount', '0') // Will be set by admin

      const response = await axios.post('http://localhost:4000/api/orders/custom-requests', requestData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setMessage('Custom design request submitted successfully!')
      
      // Reset form
      setCustomData({
        clothType: '',
        color: '',
        size: '',
        quantity: ''
      })
      setFile(null)

      // Navigate to order history after a short delay
      setTimeout(() => {
        navigate('/order-history')
      }, 2000)

    } catch (error) {
      console.error('Error submitting custom request:', error)
      setMessage('Failed to submit custom request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Please login to customize your design</div>
  }

  return (
    <div className='customize-container'>
      <div className='customize-form'>
        <h2>Customize Your Design</h2>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitRequest}>
          <div className="form-group">
            <label htmlFor="clothType">Cloth Type</label>
            <input 
              name='clothType' 
              id='clothType' 
              type='text' 
              value={customData.clothType} 
              onChange={handleChangeData}
              placeholder="e.g., T-Shirt, Hoodie, Dress"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input 
              name='color' 
              id='color' 
              type='text' 
              value={customData.color} 
              onChange={handleChangeData}
              placeholder="e.g., Red, Blue, Black"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <input 
              name='size' 
              id='size' 
              type='text' 
              value={customData.size} 
              onChange={handleChangeData}
              placeholder="e.g., S, M, L, XL, XXL"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input 
              name='quantity' 
              id='quantity' 
              type='number' 
              value={customData.quantity} 
              onChange={handleChangeData}
              min="1"
              placeholder="Enter quantity"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Design Image</label>
            <input 
              type="file" 
              name="image" 
              id="image"
              accept="image/*" 
              onChange={handleFileChange} 
              required 
            />
          </div>
          
          <button type='submit' disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CustomizeDesign