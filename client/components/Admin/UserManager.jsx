import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

export default function UserManager() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users')
      setUsers(response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`)
      console.log("Successfully deleted")
      fetchUsers() // Refresh the users list
    } catch (err) {
      console.log(err)
      alert("Failed to delete user")
    }
  }

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin'

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className='product-container'>
      <div className='table-container' >
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Address</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((item) => (
              <tr key={item._id || item.userId}>
                <td>{item._id || item.userId}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>........</td>
                <td>{item.address}</td>
                <td>{item.role || 'user'}</td>
                <td>
                  <button 
                    disabled={!isAdmin || (item._id === currentUser?._id)} 
                    onClick={() => handleDeleteUser(item._id || item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
    </div>
  )
}
