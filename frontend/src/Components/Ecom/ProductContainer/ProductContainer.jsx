import React from 'react'
import './ProductContainer.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import {Item} from '../../index';

const ProductContainer = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(props.category == null){
        const response = await axios.get('http://127.0.0.1:8000/api/EC/products/');
              setData(response.data);
            }
            else{
        const response = await axios.get(`http://127.0.0.1:8000/api/EC/products?category=${props.category}`);
              setData(response.data);
        }
    } catch (error) {
      console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [props.category]);

  
  return (
    <div>

      <h1>{props.header}</h1>

      <div className="products">
        {data.map((item) => (
        <Item
          key={item.P_ID}
          id={item.P_ID}
          name={item.P_Name}
          price={item.P_Price}
          size={item.Size}
          images={item.Images}
        />
      ))}
      </div>
    </div>
  )
}

export default ProductContainer
