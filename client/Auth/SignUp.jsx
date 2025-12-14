import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    address: ""
  })
  const { register } = useAuth()

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await register(
        formData.userName,
        formData.email,
        formData.password,
        formData.address
      )

      if (result.success) {
        setMessage('Registration successful! Redirecting to home...')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setMessage(result.error || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setMessage('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="SignInContainer">
      <form className="SignInForm" onSubmit={handleFormSubmit}>
        <div className="formData">
          <label htmlFor="userName">UserName:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleFormChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            required
          />

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {message && <span className="message">{message}</span>}
      </form>
    </div>
  )
}
