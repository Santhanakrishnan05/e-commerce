import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProduct = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discountPrice: '',
    category: '',
    description: '',
    size: '',
    colorsAvailable: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        originalPrice: product.originalPrice || '',
        discountPrice: product.discountPrice || '',
        category: product.category || '',
        description: product.description || '',
        size: product.size?.join(',') || '',
        colorsAvailable: product.colorsAvailable?.join(',') || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      if (file) updatedData.append('file', file);
      Object.keys(formData).forEach(key => {
        updatedData.append(key, formData[key]);
      });

      const res = await axios.put(
        `http://localhost:4000/api/products/${product._id}`,
        updatedData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage('Product updated successfully');
      if (onSuccess) onSuccess(res.data); // call parent to update products
    } catch (err) {
      console.error(err);
      setMessage('Error updating product');
    }
  };

  return (
    <div className="update-product-form">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required />
        <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        <input type="text" name="size" value={formData.size} onChange={handleChange} required />
        <input type="text" name="colorsAvailable" value={formData.colorsAvailable} onChange={handleChange} required />
        <input type="file" name="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Update Product</button>
      </form>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UpdateProduct;
