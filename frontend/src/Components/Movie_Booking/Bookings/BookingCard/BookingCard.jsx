import React from "react";
import "./BookingCard.css"; // Import your CSS file
import { Link } from "react-router-dom";

const BookingCard = ({ booking }) => {
  // Define the formatTime function inside the BookingCard component
  const formatTime = (timeString) => {
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeString.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formattedTime;
  };

  //  const formattedTime = formatTime(booking.B_Time);

  const movieName = booking.ShowTime_ID.M_ID.M_Name;
  const bookingTime = formatTime(booking.B_Time);
  const posterUrl = `http://127.0.0.1:8000${booking.ShowTime_ID.M_ID.images[0].img}`;

  return (
    <Link to={`/moviebooking/booking-detail/${booking.B_ID}/` } style={{textDecoration:"none",color:"black"}}>
    <div className="booking-card">
      <div className="BookingCardImg">
        <img src={posterUrl} alt={movieName} className="BookingCard-poster" />
      </div>
      <div className="BookingCardDetails">
      <h3>{movieName}</h3>
      {/* <p>Booking ID: {booking.B_ID}</p> */}
      <p>Date: {booking.B_Date}</p>
      <p>Time: {bookingTime}</p>
      <p>
        Total Amount: {"\u20B9"} {booking.TotalAmt}
      </p>
      </div>
    </div>
    </Link>
  );
};

export default BookingCard;

// import React from 'react';
// import './BookingCard.css'; // Import your CSS file

// const BookingCard = ({ booking }) => {
//  return (
//     <div className="booking-card">
//       <h3>{booking.M_Name}</h3>
//       <p>Booking ID: {booking.B_ID}</p>
//       <p>Date: {booking.B_Date}</p>
//       <p>Time: {booking.B_Time}</p>
//       <p>Total Amount: {booking.TotalAmt}</p>
//       {/* Add more details as needed */}
//     </div>
//  );
// };

// export default BookingCard;
