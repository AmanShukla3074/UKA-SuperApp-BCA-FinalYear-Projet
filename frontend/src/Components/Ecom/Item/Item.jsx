import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom';

const Item = ({id, name, price, size, images }) => {
  // const firstImage = images.length > 0 ? images[1].img : '';
  const baseUrl = 'http://127.0.0.1:8000'; // Replace with your API base URL
  const firstImage = images.length > 0 ? `${baseUrl}${images[0].img}` : '';
  return (
    <Link to={`/ecommerce/product/${id}`} className="product-item-link">
      <div className='item'>
        <div className="img">
          <img src={firstImage} alt='aa'/>
        </div>
        <div className='name' >{name}</div>
        <div className='price' >{price}</div>
        <div className='sizes'>
          {size.map((s) => (
            <span className='size' key={s.P_Size_ID}>{s.size.Size_Name} </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default Item
