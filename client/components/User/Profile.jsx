import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Profile(props) {
  const { onUpdate, message, setMessage } = props
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [pop, setPop] = useState(false)
  const [popData, setPopData] = useState({
    userName: '',
    email: '',
    password: '',
    address: ''
  })

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const handleUpdate = (userData) => {
    setPopData({
      userName: userData.userName || '',
      email: userData.email || '',
      password: '',
      address: userData.address || ''
    })
    setPop(true)
  }

  const handlePopChange = (e) => {
    const { name, value } = e.target
    setPopData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setMessage('Please login to update profile')
      return
    }

    const userId = user._id || user.userId
    if (!userId) {
      setMessage('User ID not found')
      return
    }

    try {
      await onUpdate(userId, popData)
      setPop(false)
      setPopData({
        userName: '',
        email: '',
        password: '',
        address: ''
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile')
    }
  }

  if (!user) return <h4>Please go to Login Page</h4>

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{user.role === 'admin' ? 'Admin Profile' : 'User Profile'}</h2>
        <div className="profile-detail"><strong>UserName:</strong> {user.userName}</div>
        <div className="profile-detail"><strong>Email:</strong> {user.email}</div>
        <div className="profile-detail"><strong>Address:</strong> {user.address}</div>
      </div>
      <button onClick={() => handleUpdate(user)}>Edit</button>
      <button onClick={handleSignOut}>Sign out</button>

      {pop &&
        <div className='formPop'>
          <form onSubmit={handleSubmitUpdate}>
            {/* <button className='x' onClick={() => setPop(false)}>×</button> */}
            <h3>Edit Profile</h3>
            
            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="userName">Name</label>
              <input 
                type="text" 
                name='userName' 
                value={popData.userName} 
                onChange={handlePopChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name='email' 
                value={popData.email} 
                onChange={handlePopChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name='password' 
                value={popData.password} 
                onChange={handlePopChange} 
                placeholder="Leave empty to keep current password" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                name='address' 
                value={popData.address} 
                onChange={handlePopChange} 
                required 
              />
            </div>
            
            <div className="form-actions">
              <button type='submit'>Update Profile</button>
              <button type='button' onClick={() => setPop(false)}>Cancel</button>
            </div>
          </form>
        </div>
      }
    </div>
  )
}
