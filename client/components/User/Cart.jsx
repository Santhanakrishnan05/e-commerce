import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, setCart, removeFromCart, addToCart } = useCart()
  const { products } = useAuth()

  const safeCart = cart || []
  const safeProducts = products || []

  const productsInCart = safeProducts.filter(product => {
    const productId = product._id || product.id
    return safeCart.some(item => (item._id || item.id) === productId)
  })

  
  const handleCartTaggle = (item) => {  
    const productId = item._id || item.id
    const isCart = cart.some(item => (item._id || item.id) === productId)
    if (isCart) {
      // Remove from favorites
      removeFromCart(productId)
    } else {
      // Add to favorites
      addToCart(item)
    }
  }

  const handleBuyNow = (item) => {
    navigate('/product-checkout', { state: { data: item } })
  } 



  // const removeFromCart = (id) => {
  //   const updateCart = safeCart.filter(item => (item._id || item.id) !== id)
  //   setCart(updateCart)
  // }

  const totalPrice = safeCart.reduce((sum, item) => {
    const price = parseInt(item.discountPrice || item.originalPrice || 0, 10)
    return sum + price
  }, 0)

  if (safeCart.length === 0) {
    return (
      <div className='cart-page1'>
        <h2>🛍️ Your Cart</h2>
        <p>Your cart is empty. Add some products to get started!</p>
      </div>
    )
  }

  return (
    <div className='cart-page1'>
      <h2>🛍️ Your Cart</h2>
      {productsInCart.map((item) => {
        // Get the cart item details
        const productId = item._id || item.id
        const cartItem = safeCart.find(cartItem => (cartItem._id || cartItem.id) === productId)
        const quantity = cartItem ? cartItem.quantity : 1
        
        return (
          <div key={productId} className='cart-item1'>
            <img 
              src={item.image ? `http://localhost:4000/uploads/${item.image}` : item.designLink || 'https://via.placeholder.com/100x100?text=No+Image'} 
              alt={item.name} 
              width="100" 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'
              }}
            />
            <div>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.discountPrice || item.originalPrice}</p>
              <p>Quantity: {quantity}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleBuyNow(item)}>🛒 Buy Now</button>
                <button onClick={() => handleCartTaggle(item)}>❌ Remove</button>
              </div>
            </div>
          </div>
        )
      })}
      <div className='total'>
        <p>Total Price: ₹{totalPrice}</p>
      </div>
    </div>
  )
}
