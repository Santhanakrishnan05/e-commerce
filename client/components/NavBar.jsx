import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function NavBar() {
  const [taggle, setTaggle] = useState(false)
  const { user, logout } = useAuth()
  const { getCartItemCount } = useCart()
  const navigate = useNavigate()
  const navRef = useRef(null)

  const handleTaggle = () => {
    setTaggle(prev => !prev)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setTaggle(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taggle && navRef.current && !navRef.current.contains(event.target)) {
        setTaggle(false)
      }
    }

    // Add event listener when menu is open
    if (taggle) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [taggle])

  return (
    <div className='navBar' ref={navRef}>
      <div className='navBarWeb'>
        {user ? user.role === 'user' ?
          <>
            <NavLink className='list' to='/'>Home</NavLink>
            <NavLink className='list' to='/customize'>Customize</NavLink>
            <NavLink className='list cart' to='/cart'>
              Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
            </NavLink>
            <NavLink className='list fav' to='/favourite'>Favourite</NavLink>
            <NavLink className='list' to='/order-history'>Order History</NavLink>
            <NavLink className='list' to='/profile'>Profile</NavLink>
          </>
          :
          <>
            <NavLink className='list' to='/dashBoard'>DashBoard</NavLink>
            <NavLink className='list' to='/products'>Product</NavLink>
            <NavLink className='list' to='/user-manager'>User Manager</NavLink>
            <NavLink className='list' to='/order-manager'>Order Manager</NavLink>
            <NavLink className='list' to='/admin-profile'>Profile</NavLink>
          </>
          :
          <>
            <NavLink className='list' to='/'>Home</NavLink>
            <NavLink className='list' to='/signIn'>SignIn</NavLink>
            <NavLink className='list' to='/signUp'>SignUp</NavLink>
          </>
        }
      </div>

      <div className='AuthNav'>
        {!user ?
          <>
            <NavLink className='list' to='/signIn'>SignIn</NavLink>
            <NavLink className='list' to='/signUp'>SignUp</NavLink>
          </>
          :
          <>
          </>
          // <button className='list logout-btn' onClick={handleLogout}>
          //   Logout
          // </button>
        }
      </div>

      <button className='navBarMobileIcon' onClick={handleTaggle}>☰</button>

      {taggle &&
        user ? user.role === 'user' ?
          <div className='navBarMobile'>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/'>Home</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/customize'>Customize</NavLink>
            <NavLink className='list cart' onClick={() => setTaggle(false)} to='/cart'>
              Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
            </NavLink>
            <NavLink className='list fav' onClick={() => setTaggle(false)} to='/favourite'>Favourite</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/order-history'>Order History</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/profile'>Profile</NavLink>
            {/* <button className='list logout-btn' onClick={handleLogout}>Logout</button> */}
          </div>
          :
          <div className='navBarMobile'>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/dashBoard'>DashBoard</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/products'>Product</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/user-manager'>User Manager</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/order-manager'>Order Manager</NavLink>
            <NavLink className='list' onClick={() => setTaggle(false)} to='/admin-profile'>Profile</NavLink>
            {/* <button className='list logout-btn' onClick={handleLogout}>Logout</button> */}
          </div>
          :
          <>
            {taggle &&
              <div className='navBarMobile'>
                <NavLink className='list' onClick={() => setTaggle(false)} to='/'>Home</NavLink>
                <NavLink className='list' onClick={() => setTaggle(false)} to='/signIn'>SignIn</NavLink>
                <NavLink className='list' onClick={() => setTaggle(false)} to='/signUp'>SignUp</NavLink>
              </div>
            }
          </>
      }
    </div>
  )
}

  