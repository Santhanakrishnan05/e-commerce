import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discountPrice: '',
    category: '',
    description: '',
    size: '',
    colorsAvailable: '',
    quantity: '',
    designLink: ''
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();
      productData.append('image', file); // Changed from 'file' to 'image'
      productData.append('name', formData.name);
      productData.append('originalPrice', formData.originalPrice);
      productData.append('discountPrice', formData.discountPrice);
      productData.append('category', formData.category);
      productData.append('description', formData.description);
      productData.append('size', formData.size); // Comma-separated
      productData.append('colorsAvailable', formData.colorsAvailable); // Comma-separated
      productData.append('quantity', formData.quantity);

      const res = await axios.post('/products', productData);

      setMessage('Product added successfully!');
      
      // Call onSuccess callback if provided
      if (onSuccess && res.data) {
        onSuccess(res.data.product); // Access the product from response
      }
      
      // Reset form
      setFormData({
        name: '',
        originalPrice: '',
        discountPrice: '',
        category: '',
        description: '',
        size: '',
        colorsAvailable: '',
        quantity: ''
      });
      setFile(null);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setMessage('Error uploading product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formPopProducts">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h3>Add New Product</h3>
        
        {onClose && (
          <button 
            type="button"
            className="x" 
            onClick={onClose}
          >
            ×
          </button>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input 
            type="text" 
            name="name" 
            id="name"
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="originalPrice">Original Price</label>
          <input 
            type="number" 
            name="originalPrice" 
            id="originalPrice"
            value={formData.originalPrice} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="discountPrice">Discount Price</label>
          <input 
            type="number" 
            name="discountPrice" 
            id="discountPrice"
            value={formData.discountPrice} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input 
            type="text" 
            name="category" 
            id="category"
            value={formData.category} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            name="description" 
            id="description"
            value={formData.description} 
            onChange={handleChange} 
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="size">Sizes (comma-separated)</label>
          <input 
            type="text" 
            name="size" 
            id="size"
            placeholder="S, M, L, XL, XXL"
            value={formData.size} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="colorsAvailable">Colors (comma-separated)</label>
          <input 
            type="text" 
            name="colorsAvailable" 
            id="colorsAvailable"
            placeholder="Red, Blue, Green"
            value={formData.colorsAvailable} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input 
            type="number" 
            name="quantity" 
            id="quantity"
            value={formData.quantity} 
            onChange={handleChange} 
            required 
            min="0" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input 
            type="file" 
            name="image" 
            id="image"
            accept="image/*" 
            onChange={handleFileChange} 
            required 
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
