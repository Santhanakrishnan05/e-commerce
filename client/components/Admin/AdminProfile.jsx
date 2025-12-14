import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminProfile({ onUpdate, message, setMessage }) {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showEditForm, setShowEditForm] = useState(false)
  const [editData, setEditData] = useState({
    userName: '',
    email: '',
    password: '',
    address: ''
  })

  const handleSignOut = () => {
    console.log('Sign out clicked');
    
    // Clear any messages when signing out
    if (setMessage) setMessage('')
    
    console.log('Calling logout function...');
    // Call the logout function from AuthContext to clear localStorage
    logout()
    
    console.log('Logout completed, navigating to home...');
    // Navigate to home page
    navigate('/')
    
    console.log('Navigation completed');
  }

  const handleEditClick = () => {
    setEditData({
      userName: user?.userName || '',
      email: user?.email || '',
      password: '',
      address: user?.address || ''
    })
    setShowEditForm(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = async (e) => {
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
      if (onUpdate) {
        await onUpdate(userId, editData)
        setShowEditForm(false)
        // Clear the form
        setEditData({
          userName: '',
          email: '',
          password: '',
          address: ''
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Failed to update profile')
    }
  }

  const handleCloseForm = () => {
    setShowEditForm(false)
    setEditData({
      userName: '',
      email: '',
      password: '',
      address: ''
    })
    if (setMessage) setMessage('')
  }

  if (!user) return <h4>Please go to Login Page</h4>

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{user.role === 'admin' ? 'Admin Profile' : 'User Profile'}</h2>
        <div className="profile-detail"><strong>UserName:</strong> {user.userName}</div>
        <div className="profile-detail"><strong>Email:</strong> {user.email}</div>
        <div className="profile-detail"><strong>Address:</strong> {user.address}</div>
        <div className="profile-detail"><strong>Role:</strong> {user.role}</div>
      </div>
      
      <div className="profile-actions">
        <button onClick={handleEditClick}>Edit Profile</button>
        <button onClick={handleSignOut}>Sign out</button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className='formPop'>
          <form onSubmit={handleEditSubmit}>
            {/* <button className='x' onClick={handleCloseForm}>×</button> */}
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
                value={editData.userName} 
                onChange={handleEditChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name='email' 
                value={editData.email} 
                onChange={handleEditChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name='password' 
                value={editData.password} 
                onChange={handleEditChange}
                placeholder="Leave empty to keep current password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input 
                type="text" 
                name='address' 
                value={editData.address} 
                onChange={handleEditChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type='submit'>Update Profile</button>
              <button type='button' onClick={handleCloseForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
