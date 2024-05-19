import React from 'react'
import './Movie_Item.css'
import { Link } from 'react-router-dom';

const Movie_Item = ({id, name, images,genre }) => {
  // const firstImage = images.length > 0 ? images[1].img : '';
  const baseUrl = 'http://127.0.0.1:8000'; // Replace with your API base URL
  const firstImage = images.length > 0 ? `${baseUrl}${images[0].img}` : '';

  return (
    <Link to={`/moviebooking/movie/${id}`} className="movie-link">
      <div className='movie'>
        <div className="img">
          <img src={firstImage} alt='aa'/>
        </div>
        <div className='name' >{name}</div>
        <div className='genres'>
          {genre.map((s) => (
            <span className='genre' key={s.Genre_ID.Genre_ID}>{s.Genre_ID.Genre_Name} </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default Movie_Item
