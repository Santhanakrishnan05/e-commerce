import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Favourites() {
  const navigate = useNavigate()
  const { favorites: fav, setFavorites: setFav, removeFromFavorites, addToFavorites } = useCart()
  const { products } = useAuth()

    const handleFavTaggle = (item) => {
      const productId = item._id || item.id
      const isFav = fav.some(item => (item._id || item.id) === productId)
      if (isFav) {
        // Remove from favorites
        removeFromFavorites(productId)
      } else {
        // Add to favorites
        addToFavorites(item)
      }
    }

    const handleBuyNow = (item) => {
      navigate('/product-checkout', { state: { data: item } })
    } 
    
  // const safeFav = fav || []
  const safeProducts = products || []

  const productsInFav = safeProducts.filter(product => {
    const productId = product._id || product.id
    return fav.some(item => (item._id || item.id) === productId)
  })

  if (fav.length === 0) {
    return (
      <div className='cart-page1'>
        <h2>🛍️ Your Favourites</h2>
        <p>You haven't added any products to your favourites yet.</p>
      </div>
    )
  }

  return (
    <div className='cart-page1'>
      <h2>🛍️ Your Favourites</h2>
      {productsInFav.map((item) => {
        const productId = item._id || item.id
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleBuyNow(item)}>🛒 Buy Now</button>
                <button onClick={()=>handleFavTaggle(item)}>❌ Remove from Favourites</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
