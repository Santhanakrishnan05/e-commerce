import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import AddProduct from './addProducts'
import UpdateProduct from './updateProduct'

export default function ProductManager() {
  const { products, setProducts } = useAuth()
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:8080/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setEditingProduct(null);
    setShowUpdateModal(false);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    handleCloseUpdateModal();
  };

  return (
    <div className='product-container'>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Size</th>
              <th>Colors</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map((item, index)=> (
              <tr key={item.id || index}>
                <td>{item.name}</td>
                <td>
                  <img 
                    src={`http://localhost:8080/uploads/${item.image}`} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                  />
                </td>
                <td>
                  <del>₹{item.originalPrice}</del><br/>
                  ₹{item.discountPrice}
                </td>
                <td>{Array.isArray(item.size) ? item.size.join(', ') : item.size}</td>
                <td>{Array.isArray(item.colorsAvailable) ? item.colorsAvailable.join(', ') : item.colorsAvailable}</td>
                <td>
                  <button onClick={() => handleEditProduct(item)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No products found</td>
            </tr>
          )}
          <tr>
            <td colSpan="6" style={{ textAlign: 'right' }}>
              <button onClick={() => setShowAddModal(true)}>Add New Product</button>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className='popDiv'>
          <AddProduct 
            onClose={() => setShowAddModal(false)}
            onSuccess={(newProduct) => {
              setProducts(prev => [...prev, newProduct]);
              setShowAddModal(false);
            }}
          />
        </div>
      )}
      
      {/* Update Product Modal */}
      {showUpdateModal && editingProduct && (
        <div className='popDiv'>
          <UpdateProduct
            product={editingProduct}
            onClose={handleCloseUpdateModal}
            onSuccess={handleUpdateSuccess}
          />
        </div>
      )}
    </div>
  )
}
