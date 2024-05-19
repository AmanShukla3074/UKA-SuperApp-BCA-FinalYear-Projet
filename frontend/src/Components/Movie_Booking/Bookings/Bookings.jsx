import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../Context/AuthContext';
import BookingCard from './BookingCard/BookingCard'; // Assuming you have a BookingCard component
import './Bookings.css'; // Import your CSS file

const Bookings = () => {
 const { authTokens } = useContext(AuthContext);
 const [bookings, setBookings] = useState([]);

 useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Movie/bookings/', {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
 }, [authTokens]);

 return (
  <>
      <h1 style={{marginTop:"150px"}}>Your Bookings</h1>
    <div className="bookings-wrapper">
      {bookings.map((booking) => (
        <div className="bookings">
        <BookingCard key={booking.B_ID} booking={booking} />
        </div>
      ))}
    </div></>
 );
};

export default Bookings;
