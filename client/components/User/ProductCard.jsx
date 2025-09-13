import React from 'react'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({data}) {
  const { name, originalPrice, discountPrice, designLink, description, quantity, size, colorsAvailable, image } = data
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    favorites: fav, 
    addToFavorites, 
    removeFromFavorites 
  } = useCart()
  const navigate = useNavigate()
  
  // Get the correct product ID
  const productId = data._id || data.id
  
  // Check if item is in cart
  const isCart = cart.some(item => (item._id || item.id) === productId)
  
  // Check if item is in favorites
  const isFav = fav.some(item => (item._id || item.id) === productId)
  
  // Use uploaded image if available, otherwise fall back to designLink
  const imageSrc = image ? `http://localhost:4000/uploads/${image}` : designLink || '';

  const handleCartTaggle = () => {
    if (isCart) {
      // Remove from cart
      removeFromCart(productId)
    } else {
      // Add to cart
      addToCart(data, 1)
    }
  }

  const handleFavTaggle = () => {
    if (isFav) {
      // Remove from favorites
      removeFromFavorites(productId)
    } else {
      // Add to favorites
      addToFavorites(data)
    }
  }
  
  const handleSendProduct = () => {
    navigate('/product-checkout', { state: { data, isFav, isCart } });
  }

  return (
    <div className='cart-container'>
      <div className='cart-item'>
        <div className='imageCon'>
        <img 
          src={imageSrc} 
          alt={name}
          // onError={(e) => {
          //   console.log('Image failed to load:', imageSrc)
          //   // Fallback to a placeholder image if the main image fails to load
          //   e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          // }}
        />
        </div>
        <div className='item-details'>
          <h2>{name}</h2>
          <p className="description">{description}</p>
          <p>Quantity: {quantity}</p>
          <p>Sizes: {Array.isArray(size) ? size.join(', ') : size || 'N/A'}</p>
          <p>Colors: {Array.isArray(colorsAvailable) ? colorsAvailable.join(', ') : colorsAvailable || 'N/A'}</p>
          <p>
            <span className="original"><del>₹{originalPrice}</del> </span>
            <span className="discount"> ₹{discountPrice}</span>
          </p>
          <div className="buttons">
            <button onClick={handleFavTaggle} className="fav"> 
              {isFav ? "❤️ Fav" : "🤍 Fav"}
            </button>
            <button onClick={handleCartTaggle} className="remove">
              {isCart ? '🗑️ Remove' : '🛒 Add to Cart' }
            </button>
            <button onClick={handleSendProduct}  className="buy">🛒 Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}
