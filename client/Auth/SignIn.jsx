import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigate based on user role
        if (result.user.role === "user") {
          navigate("/");
        } else if (result.user.role === "admin") {
          navigate("/dashBoard");
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='SignInContainer'>
      <form action="" className='SignInForm' onSubmit={handleSubmitSignIn}>
        <div className='formData'>
          <label htmlFor="email">Email:</label>
          <input 
            type='email' 
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label htmlFor="password">Password:</label>
          <input 
            type='password' 
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
