import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import the star icons
import './StarRating.css'
const StarRating = ({ rating }) => {
 const stars = [];
 for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<FaStar key={i} />); // Use filled star icon
    } else {
      stars.push(<FaRegStar key={i} />); // Use outlined star icon
    }
 }

 return <div className="star-rating">{stars}</div>;
};

export default StarRating;
