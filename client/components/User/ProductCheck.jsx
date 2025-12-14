import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function ProductCheck() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isFav, isCart } = location.state || {};

  // Auth context (for direct, setDirect, handleChangeProductData, handleSubmitProduct)
  const { direct, setDirect, handleChangeProductData, handleSubmitProduct, orderFormData, setOrderFormData } = useAuth();
  // Cart context (for cart, favorites, and cart functions)
  const { cart, favorites: fav, addToCart, removeFromCart, addToFavorites, removeFromFavorites } = useCart();

  // Set initial form data when component loads
  useEffect(() => {
    if (data) {
      setOrderFormData(prev => ({
        ...prev,
        clothType: data.name
      }));
    }
  }, [data, setOrderFormData]);

  if (!data) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No product data provided</h2>
        <p>Please navigate to this page from a product card.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  const imageSrc = data.image ? `http://localhost:8080/uploads/${data.image}` : '';
  
  // Handle navigation to order history after successful order
  useEffect(() => {
    if (direct) {
      navigate('/order-history');
      setDirect(false);
    }
  }, [direct, navigate, setDirect]);
  const handleFavToggle = () => {
    const productId = data.id;
    if (fav.some(item => (item.id) === productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(data);
    }
  };

  const handleCartToggle = () => {
    const productId = data.id;
    if (cart.some(item => (item.id) === productId)) {
      removeFromCart(productId);
    } else {
      addToCart(data);
    }
  };

  return (
    <div className='cart-container1'>
      <div className='cart-item1'>
        <div className='imageCon1'>
          <img 
          src={imageSrc} 
          alt={data.name}
        />
        </div>
        <div className='item-details1'>
          <h2>{data.name}</h2>
          <p className="description1">{data.description}</p>
          <p>Quantity: {data.quantity}</p>
          <p>Sizes: {data.size.join(', ')}</p>
          <p>Colors: {data.colorsAvailable.join(', ')}</p>
          <p>
            <span className="original1"><del>{data.originalPrice}</del></span>
            <span className="discount1"> {data.discountPrice}</span>
          </p>

          <div className="buttons">
            <button onClick={handleFavToggle} className="fav">
              {fav.some(item => (item.id) === (data.id)) ? "❤️ Fav" : "🤍 Fav"}
            </button>
            <button onClick={handleCartToggle} className="remove">
              {cart.some(item => (item.id) === (data.id)) ? '🗑️ Remove' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>

        <div className='profile-container1' >
          <h2>Place Your Order</h2>
          <form className='formPop1' onSubmit={(e) => handleSubmitProduct(e, data)} >
            <label htmlFor="1">Cloth Type :</label>
            <input className='clothName input' disabled={true} name='clothType' id='1' type='text' value={orderFormData.clothType} onChange={handleChangeProductData} />

            <label htmlFor="2">Color :</label>
            <select className='input' name="color" value={orderFormData.color} onChange={handleChangeProductData}>
              <option value="" disabled>Select a Color</option>
              {data.colorsAvailable.map((colorOption, index) => (
                <option key={index} value={colorOption}>{colorOption}</option>
              ))}
            </select>
            <label htmlFor="3">Size : [S, M, L, XL, XXL]</label>
            <select className='input' name="size" value={orderFormData.size} onChange={handleChangeProductData}>
              <option value="" disabled>Select a Size</option>
              {data.size.map((sizeOption, index) => (
                <option key={index} value={sizeOption}>{sizeOption}</option>
              ))}
            </select>

            <label htmlFor="4">Quantity :</label>
            <input className='input' name='quantity' id='4' type='number' value={orderFormData.quantity} onChange={handleChangeProductData} min="1" />
            <button type='submit'>Place Order</button>
          </form>
        </div>
      </div>
    </div>
  );
}
