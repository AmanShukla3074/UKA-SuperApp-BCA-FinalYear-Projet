import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./SeatShowtime.css";
import AuthContext from "../../../Context/AuthContext";

import Notification from "../../Notification/Notification";
const SeatShowtime = () => {
  const { authTokens } = useContext(AuthContext);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  const { showtimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/showtimes/${showtimeId}/seats/`
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [showtimeId]);

  useEffect(() => {
    const total = selectedSeats.reduce((acc, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return acc + (seat ? seat.Price : 0);
    }, 0);
    setTotalPrice(total);
  }, [selectedSeats, seats]);

  const seatsByTypeAndRow = seats.reduce((acc, seat) => {
    const seatType = seat.seat.Seat_Type.Seat_type_Name;
    const row = seat.seat.Seat_Row_AlphaBet;

    if (!acc[seatType]) {
      acc[seatType] = {};
    }

    if (!acc[seatType][row]) {
      acc[seatType][row] = [];
    }

    acc[seatType][row].push(seat);
    return acc;
  }, {});

  const handleSeatClick = (seat) => {
    if (!seat.is_booked) {
      // Toggle seat selection
      setSelectedSeats((prevSelectedSeats) => {
        const isSelected = prevSelectedSeats.includes(seat.id);
        const updatedSelectedSeats = isSelected
          ? prevSelectedSeats.filter((selectedSeat) => selectedSeat !== seat.id)
          : [...prevSelectedSeats, seat.id];

        console.log(updatedSelectedSeats);
        return updatedSelectedSeats;
      });
    }
  };

  const isSeatSelected = (seat) => {
    return selectedSeats.includes(seat.id);
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Movie/bookings/",
        {
          ShowTime_ID: showtimeId,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
          },
        }
      );

      if (response.status === 201) {
        const B_ID = response.data.B_ID;

        if (B_ID) {
          const bookingResponse = await axios.post(
            "http://127.0.0.1:8000/api/Movie/booking-seats/",
            {
              B_ID: B_ID,
              seat_ids: selectedSeats,
            },
            {
              headers: {
                Authorization: `Bearer ${authTokens?.access}`,
              },
            }
          );

          if (bookingResponse.status === 201) {
            // alert("Payment and seat booking successful!");

            setNotificationMessage("Booking successfully done.");
            setNotificationColor("green");
            setShowNotification(true);

            setTimeout(() => {
              setShowNotification(false);
              navigate("/moviebooking");
            }, 2000);
          } else {
            alert("booking failed. Please try again.");
            setNotificationMessage("Checkout failed. Please try again.");
            setNotificationColor("red");
            setShowNotification(true);
            setTimeout(() => {
              setShowNotification(false);
            }, 3000);
          }
        } else {
          alert("to get B_ID. Please try again.");
          setNotificationMessage("Checkout failed. Please try again.");
          setNotificationColor("red");
          setShowNotification(true);

          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      } else {
        alert("Failed create booking. Please try again.");
        setNotificationMessage("Checkout failed. Please try again.");
        setNotificationColor("red");
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error during payment and seat booking:", error);
      alert(
        "An error occurred during payment and seat booking. Please try again."
      );
    }
  };

  return (
    <>
      {showNotification && (
        <Notification message={notificationMessage} color={notificationColor} />
      )}
      <div className="seat-showtime-container">
        <h2>Seat Selection</h2>
        {Object.entries(seatsByTypeAndRow).map(([seatType, rows]) => (
          <div key={seatType} className="seat-type">
            <p className="seat-type-label">
              {seatType} - {rows[Object.keys(rows)[0]][0].Price}
            </p>
            {Object.entries(rows).map(([row, seatsInRow]) => (
              <div key={row} className="seat-row">
                <p className="row-label">{row}</p>
                <div className="showtime-details">
                  {seatsInRow.map((seat) => (
                    <div
                      key={seat.id}
                      className={`showtime-item ${
                        isSeatSelected(seat) ? "selected" : ""
                      }`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      <p
                        className={`seat-number ${
                          isSeatSelected(seat) ? "selected" : ""
                        } ${seat.is_booked ? "booked" : ""}`}
                      >
                        {seat.seat.Seat_Col_Num}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {totalPrice > 0 && (
        <div className="total-price-box">
          {/* <p>Pay : {'\u20B9'}{totalPrice.toFixed(2)}</p> */}
          <button onClick={handlePayment} className="payment-button">
            <p>
              Pay : {"\u20B9"}
              {totalPrice.toFixed(2)}
            </p>
          </button>
        </div>
      )}
    </>
  );
};

export default SeatShowtime;

// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "./SeatShowtime.css";
// import AuthContext from "../../../Context/AuthContext";

// const SeatShowtime = () => {
//   const { authTokens } = useContext(AuthContext);

//   const { showtimeId } = useParams();
//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSeats = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/Movie/showtimes/${showtimeId}/seats/`
//         );
//         setSeats(response.data);
//       } catch (error) {
//         console.error("Error fetching seats:", error);
//       }
//     };

//     fetchSeats();
//   }, [showtimeId]);

//   useEffect(() => {
//     const total = selectedSeats.reduce((acc, seatId) => {
//       const seat = seats.find((s) => s.id === seatId);
//       return acc + (seat ? seat.Price : 0);
//     }, 0);
//     setTotalPrice(total);
//   }, [selectedSeats, seats]);

//   const seatsByTypeAndRow = seats.reduce((acc, seat) => {
//     const seatType = seat.seat.Seat_Type.Seat_type_Name;
//     const row = seat.seat.Seat_Row_AlphaBet;

//     if (!acc[seatType]) {
//       acc[seatType] = {};
//     }

//     if (!acc[seatType][row]) {
//       acc[seatType][row] = [];
//     }

//     acc[seatType][row].push(seat);
//     return acc;
//   }, {});

//   const handleSeatClick = (seat) => {
//     if (!seat.is_booked) {
//       // Toggle seat selection
//       setSelectedSeats((prevSelectedSeats) => {
//         const isSelected = prevSelectedSeats.includes(seat.id);
//         const updatedSelectedSeats = isSelected
//           ? prevSelectedSeats.filter((selectedSeat) => selectedSeat !== seat.id)
//           : [...prevSelectedSeats, seat.id];

//         console.log(updatedSelectedSeats);
//         return updatedSelectedSeats;
//       });
//     }
//   };

//   const isSeatSelected = (seat) => {
//     return selectedSeats.includes(seat.id);
//   };

//   const handlePayment = async () => {
//     try {

//        const response = await axios.post(
//          "http://127.0.0.1:8000/api/Movie/bookings/",
//          {
//            ShowTime_ID: showtimeId,
//          },
//          {
//            headers: {
//              Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
//            },
//          }
//        );

//        if (response.status === 201) {
//          const B_ID = response.data.B_ID;

//          if (B_ID) {
//            const bookingResponse = await axios.post(
//              "http://127.0.0.1:8000/api/Movie/booking-seats/",
//              {
//                B_ID: B_ID,
//                seat_ids: selectedSeats,
//              },
//              {
//                headers: {
//                  Authorization: `Bearer ${authTokens?.access}`,
//                },
//              }
//            );

//            if (bookingResponse.status === 201) {
//              alert("Payment and seat booking successful!");
//              navigate("/moviebooking");
//            } else {
//              alert("Seat booking failed. Please try again.");
//            }
//          } else {
//            alert("Failed to get B_ID. Please try again.");
//          }
//        } else {
//          alert("Failed to create booking. Please try again.");
//        }
//     } catch (error) {
//        console.error("Error during payment and seat booking:", error);
//        alert("An error occurred during payment and seat booking. Please try again.");
//     }
//    };

//   return (
//     <>
//       <div className="seat-showtime-container">
//         <h2>Seat Selection</h2>
//         {Object.entries(seatsByTypeAndRow).map(([seatType, rows]) => (
//           <div key={seatType} className="seat-type">
//             <p className="seat-type-label">
//               {seatType} - {rows[Object.keys(rows)[0]][0].Price}
//             </p>
//             {Object.entries(rows).map(([row, seatsInRow]) => (
//               <div key={row} className="seat-row">
//                 <p className="row-label">{row}</p>
//                 <div className="showtime-details">
//                   {seatsInRow.map((seat) => (
//                     <div
//                       key={seat.id}
//                       className={`showtime-item ${
//                         isSeatSelected(seat) ? "selected" : ""
//                       }`}
//                       onClick={() => handleSeatClick(seat)}
//                     >
//                       <p
//                         className={`seat-number ${
//                           isSeatSelected(seat) ? "selected" : ""
//                         } ${seat.is_booked ? "booked" : ""}`}
//                       >
//                         {seat.seat.Seat_Col_Num}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//       {totalPrice > 0 && (
//  <div className="total-price-box">
//     {/* <p>Pay : {'\u20B9'}{totalPrice.toFixed(2)}</p> */}
//     <button onClick={handlePayment} className="payment-button">
//     <p>Pay : {'\u20B9'}{totalPrice.toFixed(2)}</p>
//     </button>
//  </div>
// )}
//     </>
//   );
// };

// export default SeatShowtime;
