import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProductCard from './ProductCard'

export default function Home() {
  const [Search, SetSearch] = useState("")
  const [Filter, SetFilter] = useState("All Category")
  const [Filter1, SetFilter1] = useState("")
  const { products } = useAuth()
  const safeProducts = Array.isArray(products) ? products : []

  // // Debug logging
  // console.log('Home component - products:', products)
  // console.log('Home component - safeProducts:', safeProducts)

  const filterProduct = safeProducts
    .filter(item => 
      item.name.toLowerCase().includes(Search.toLowerCase()))
    .sort((a, b) => {
      if (Filter1 === 'Low To High') {
        return a.discountPrice - b.discountPrice
      }
      else if (Filter1 === 'High To Low') {
        return b.discountPrice - a.discountPrice
      }
      else {
        return 0
      }
    })

    // console.log('Home component - filterProduct:', filterProduct)

  return (
    <div className='home'>
      <div className='home-top'>
        <input className='search' placeholder='Search Cloths' type='text' value={Search} onChange={(e) => { SetSearch(e.target.value); SetFilter(e.target.value); }} />
        <select className='select' onChange={(e) => { SetFilter(e.target.value); SetFilter1(e.target.value); }}>
          <option value="">Sort By</option>
          <option value="Low To High">Low</option>
          <option value="High To Low">High</option>
        </select>
      </div>
      <h3>{Filter ? Filter : Filter1}</h3>

      <div className='productDisplay'>
        {filterProduct.length === 0 ? <h1>No Items</h1> :
          filterProduct
            .map((item, index) => (
              <ProductCard key={index} data={item} />
            ))
        }
      </div>
    </div>
  )
}
