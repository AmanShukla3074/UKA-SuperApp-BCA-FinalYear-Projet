import React from 'react'
import './Movie_Container.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import {Movie_Item} from '../..';

const Movie_Container = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Movie/movies/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div>

      <h1>Movies</h1>

      <div className="container">
        {data.map((item) => (
        <Movie_Item 
          key={item.M_ID}
          id={item.M_ID}
          name={item.M_Name}
          images={item.images}
          genre={item.genre}
        />
      ))}
      </div>
    </div>
  )
}

export default Movie_Container
