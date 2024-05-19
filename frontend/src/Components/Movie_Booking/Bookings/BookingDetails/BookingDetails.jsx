import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import AuthContext from "../../../../Context/AuthContext";
import { useParams } from "react-router-dom";
import "./BookingDetails.css";
import { jwtDecode } from "jwt-decode";
import Notification from "../../../Notification/Notification";

const BookingDetails = () => {
  const { authTokens } = useContext(AuthContext);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [qrData, setQrData] = useState("");
  const { bookingId } = useParams(); 

  const [complaintType, setComplaintType] = useState(null); 
  const [complaintDesc, setComplaintDesc] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const userId = authTokens ? jwtDecode(authTokens.access).user_id : null;

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const checkReviewSubmission = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/rate_movie?User_ID=${userId}&M_ID=${bookingDetails?.ShowTime_ID.M_ID.M_ID}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        if (
          response.data.length > 0 &&
          response.data[0].Rate_Movie !== null &&
          response.data[0].Rate_Movie !== undefined
        ) {
          setHasSubmittedReview(true);
          const rating = response.data[0].Rate_Movie;
          setUserRating(rating);
                   // Update the key to force a re-render
                   setComponentKey(prevKey => prevKey + 1);
        }
      } catch (error) {
        console.error("Failed to check review submission:", error);
      }
    };

    if (authTokens && bookingDetails) {
      checkReviewSubmission();
    }
  }, [authTokens, bookingDetails, userId]);


  const handleRatingSubmit = async () => {
    if (hasSubmittedReview) {
       alert("You have already submitted a review for this movie.");
       return;
    }
    try {
       const response = await axios.post(
         `http://127.0.0.1:8000/api/Movie/rate_movie/`,
         {
           User_ID: userId,
           M_ID: bookingDetails.ShowTime_ID.M_ID.M_ID,
           Rate_Movie: rating,
         },
         {
           headers: {
             Authorization: `Bearer ${authTokens?.access}`,
           },
         }
       );
       console.log("Rating submitted successfully:", response.data);
      //  alert("Thank you for your rating!");
      setNotificationMessage("Thank you for your rating!");
      setNotificationColor("green");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000); 

       setHasSubmittedReview(true);
       setUserRating(rating);
    } catch (error) {
       console.error("Failed to submit rating:", error);
    }
   };
   

   

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleComplaintSubmit = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/Movie/complaint/`,
        {
          M_ID:
            complaintType === "movie"
              ? bookingDetails.ShowTime_ID.M_ID.M_ID
              : null,
          T_ID:
            complaintType === "theater"
              ? bookingDetails.ShowTime_ID.Screen_M.T_ID.T_ID
              : null,
          Complaint_Desc: complaintDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
          },
        }
      );
      console.log("Complaint submitted successfully:", response.data);
      setNotificationMessage("Complaint submitted successfully");
      setNotificationColor("green");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      setComplaintType(null); // Reset the complaint type after submission
      setDropdownOpen(false); // Close the dropdown after submission
      // alert(
      //   "Sorry for the inconvenience. Your complaint has been submitted. We will work on it."
      // );
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/bookings/${bookingId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
            },
          }
        );

        setBookingDetails(response.data);

        // Prepare data for QR code
        const qrInfo = `Booking ID: ${response.data.B_ID}, Movie Name: ${
          response.data.ShowTime_ID.M_ID.M_Name
        }, Show Time: ${response.data.ShowTime_ID.StartTime}, Date: ${
          response.data.ShowTime_ID.Date
        }, Seats: ${response.data.Seats.map(
          (seat) =>
            `${seat.Seat_ID.seat.Seat_Row_AlphaBet}${seat.Seat_ID.seat.Seat_Col_Num}`
        ).join(", ")}, Theater: ${
          response.data.ShowTime_ID.Screen_M.T_ID.T_Name
        }, Screen: ${response.data.ShowTime_ID.Screen_M.Screen_Name}`;
        setQrData(qrInfo);
        console.log(qrInfo);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
      }
    };

    if (authTokens && bookingId) {
      fetchBookingDetails();
    }
  }, [authTokens, bookingId]); // Corrected dependency array

  if (!bookingDetails) {
    return <div>Loading booking details...</div>;
  }

  // Extracting ticket details from the response
  const { SubTotal, gst_amount, TotalAmt } = bookingDetails;
  const showTime = bookingDetails.ShowTime_ID.StartTime;
  const [hours, minutes, seconds] = showTime.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));

  // Format hours to 12-hour format and determine AM/PM
  const formattedHours =
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const amPm = date.getHours() >= 12 ? "PM" : "AM";

  


  return (
    <>
    {showNotification && (
        <Notification message={notificationMessage} color={notificationColor} />
      )}
      <div className="booking-details-wrapper">
        <div className="booking-details">
          <div className="booking-text-detail">
            <h2>Booking Details</h2>
            <p>Movie Name: {bookingDetails.ShowTime_ID.M_ID.M_Name}</p>
            <p>
              Show Time: {formattedHours}:{minutes} {amPm}
            </p>
            <p>Date: {bookingDetails.ShowTime_ID.Date}</p>
            <p>
              Seats:{" "}
              {bookingDetails.Seats.map(
                (seat) =>
                  `${seat.Seat_ID.seat.Seat_Row_AlphaBet}${seat.Seat_ID.seat.Seat_Col_Num}`
              ).join(", ")}
            </p>
            <p>Theater: {bookingDetails.ShowTime_ID.Screen_M.T_ID.T_Name}</p>
            <p>Screen: {bookingDetails.ShowTime_ID.Screen_M.Screen_Name}</p>
          </div>
          <div className="booking-QR-wrapper">
            <QRCode value={qrData} className="booking-QR" size={200} />
          </div>
        </div>
        <div className="ticket-details">
          <h3>Ticket Details</h3>
          <p>Total Tickets: Tickets - {bookingDetails.Seats.length}</p>
          <p>Subtotal: {"\u20B9"}{SubTotal}</p>
          <p>GST Amount: {"\u20B9"}{gst_amount}</p>
          <p>Total Amount: {"\u20B9"}{TotalAmt}</p>
        </div>
      </div>

      {!hasSubmittedReview && (
        <div className="ratingFormWrapper" key={componentKey}>
          <h3>Rate this Movie</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRatingSubmit();
            }}
          >
            <label>
              Rating (1-10):
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <button type="submit">Submit Rating</button>
          </form>
        </div>
      )}
      {hasSubmittedReview && (
        <div className="ratingFormWrapper" style={{ textAlign: "center" }}>
          <h3>{`You have already submitted a review for this movie. Your rating was ${userRating}/10.`}</h3>
        </div>
      )}

      <div className="dropdownBookingWrapper">
        <div className="dropdown">
          <button className="dropdownBtn" onClick={toggleDropdown}>
            Submit Complaint ▼
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              <button
                onClick={() => {
                  setComplaintType("movie");
                  toggleDropdown();
                }}
              >
                Complain about Movie
              </button>
              <button
                onClick={() => {
                  setComplaintType("theater");
                  toggleDropdown();
                }}
              >
                Complain about Theater
              </button>
            </div>
          )}
        </div>
        {complaintType === "movie" && (
          <div>
            <h3>
              Complaint about Movie: {bookingDetails?.ShowTime_ID.M_ID.M_Name}
            </h3>
            <form
              className="MBComplaintForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleComplaintSubmit();
              }}
            >
              <label>
                Complaint Description: <br />
                <textarea
                  className="MBComplaintArea"
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </label>
              <div className="dropDownCloseSubBtnWrapper">
                <button className="dropDownCloseSubBtn" type="submit">
                  Submit
                </button>
                <button
                  className="dropDownCloseSubBtn"
                  onClick={() => setComplaintType(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
        {complaintType === "theater" && (
          <div>
            <h3>
              Complaint about Theater:{" "}
              {bookingDetails?.ShowTime_ID.Screen_M.T_ID.T_Name}
            </h3>
            <form
              className="MBComplaintForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleComplaintSubmit();
              }}
            >
              <label>
                Complaint Description: <br />
                <textarea
                  className="MBComplaintArea"
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </label>
              <div className="dropDownCloseSubBtnWrapper">
                <button className="dropDownCloseSubBtn" type="submit">
                  Submit
                </button>
                <button
                  className="dropDownCloseSubBtn"
                  onClick={() => setComplaintType(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingDetails;







/*
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import AuthContext from "../../../../Context/AuthContext"; // Adjust the path as necessary
import { useParams } from "react-router-dom";
import "./BookingDetails.css"; // Import the CSS file
import { jwtDecode } from "jwt-decode";
// import { jwtDecode } from "jwt-decode";

const BookingDetails = () => {
  const { authTokens } = useContext(AuthContext);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [qrData, setQrData] = useState("");
  const { bookingId } = useParams(); // Use useParams to get the bookingId

  const [complaintType, setComplaintType] = useState(null); // 'movie' or 'theater'
  const [complaintDesc, setComplaintDesc] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
  const userId = authTokens ? jwtDecode(authTokens.access).user_id : null;

  useEffect(() => {
    const checkReviewSubmission = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/rate_movie?User_ID=${userId}&M_ID=${bookingDetails?.ShowTime_ID.M_ID.M_ID}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        if (
          response.data.length > 0 &&
          response.data[0].Rate_Movie !== null &&
          response.data[0].Rate_Movie !== undefined
        ) {
          setHasSubmittedReview(true);
          // Assuming the response data contains the rating in a property named 'Rate_Movie'
          const rating = response.data[0].Rate_Movie;
          setUserRating(rating);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Failed to check review submission:", error);
      }
    };

    if (authTokens && bookingDetails) {
      checkReviewSubmission();
    }
  }, [authTokens, bookingDetails, userId]);

  const handleRatingSubmit = async () => {
    if (hasSubmittedReview) {
      alert("You have already submitted a review for this movie.");
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/Movie/rate_movie/`,
        {
          User_ID: userId,
          M_ID: bookingDetails.ShowTime_ID.M_ID.M_ID,
          Rate_Movie: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      console.log("Rating submitted successfully:", response.data);
      alert("Thank you for your rating!");
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleComplaintSubmit = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/Movie/complaint/`,
        {
          M_ID:
            complaintType === "movie"
              ? bookingDetails.ShowTime_ID.M_ID.M_ID
              : null,
          T_ID:
            complaintType === "theater"
              ? bookingDetails.ShowTime_ID.Screen_M.T_ID.T_ID
              : null,
          Complaint_Desc: complaintDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
          },
        }
      );
      console.log("Complaint submitted successfully:", response.data);
      setComplaintType(null); // Reset the complaint type after submission
      setDropdownOpen(false); // Close the dropdown after submission
      alert(
        "Sorry for the inconvenience. Your complaint has been submitted. We will work on it."
      );
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/bookings/${bookingId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
            },
          }
        );

        setBookingDetails(response.data);

        // Prepare data for QR code
        const qrInfo = `Booking ID: ${response.data.B_ID}, Movie Name: ${
          response.data.ShowTime_ID.M_ID.M_Name
        }, Show Time: ${response.data.ShowTime_ID.StartTime}, Date: ${
          response.data.ShowTime_ID.Date
        }, Seats: ${response.data.Seats.map(
          (seat) =>
            `${seat.Seat_ID.seat.Seat_Row_AlphaBet}${seat.Seat_ID.seat.Seat_Col_Num}`
        ).join(", ")}, Theater: ${
          response.data.ShowTime_ID.Screen_M.T_ID.T_Name
        }, Screen: ${response.data.ShowTime_ID.Screen_M.Screen_Name}`;
        setQrData(qrInfo);
        console.log(qrInfo);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
      }
    };

    if (authTokens && bookingId) {
      fetchBookingDetails();
    }
  }, [authTokens, bookingId]); // Corrected dependency array

  if (!bookingDetails) {
    return <div>Loading booking details...</div>;
  }

  // Extracting ticket details from the response
  const { SubTotal, gst_amount, TotalAmt } = bookingDetails;
  const showTime = bookingDetails.ShowTime_ID.StartTime;
  const [hours, minutes, seconds] = showTime.split(":");
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));

  // Format hours to 12-hour format and determine AM/PM
  const formattedHours =
    date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const amPm = date.getHours() >= 12 ? "PM" : "AM";

  return (
    <>
      <div className="booking-details-wrapper">
        <div className="booking-details">
          <div className="booking-text-detail">
            <h2>Booking Details</h2>
            <p>Movie Name: {bookingDetails.ShowTime_ID.M_ID.M_Name}</p>
            <p>
              Show Time: {formattedHours}:{minutes} {amPm}
            </p>
            <p>Date: {bookingDetails.ShowTime_ID.Date}</p>
            <p>
              Seats:{" "}
              {bookingDetails.Seats.map(
                (seat) =>
                  `${seat.Seat_ID.seat.Seat_Row_AlphaBet}${seat.Seat_ID.seat.Seat_Col_Num}`
              ).join(", ")}
            </p>
            <p>Theater: {bookingDetails.ShowTime_ID.Screen_M.T_ID.T_Name}</p>
            <p>Screen: {bookingDetails.ShowTime_ID.Screen_M.Screen_Name}</p>
          </div>
          <div className="booking-QR-wrapper">
            <QRCode value={qrData} className="booking-QR" size={200} />
          </div>
        </div>
        <div className="ticket-details">
          <h3>Ticket Details</h3>
          <p>Total Tickets: Tickets - {bookingDetails.Seats.length}</p>
          <p>Subtotal: ${SubTotal}</p>
          <p>GST Amount: ${gst_amount}</p>
          <p>Total Amount: ${TotalAmt}</p>
        </div>
      </div>

      {!hasSubmittedReview && (
        <div className="ratingFormWrapper">
          <h3>Rate this Movie</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRatingSubmit();
            }}
          >
            <label>
              Rating (1-10):
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <button type="submit">Submit Rating</button>
          </form>
        </div>
      )}
      {hasSubmittedReview && (
        <div className="ratingFormWrapper" style={{ textAlign: "center" }}>
          <h3>{`You have already submitted a review for this movie. Your rating was ${userRating}/10.`}</h3>
        </div>
      )}

      <div className="dropdownBookingWrapper">
        <div className="dropdown">
          <button className="dropdownBtn" onClick={toggleDropdown}>
            Submit Complaint ▼
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              <button
                onClick={() => {
                  setComplaintType("movie");
                  toggleDropdown();
                }}
              >
                Complain about Movie
              </button>
              <button
                onClick={() => {
                  setComplaintType("theater");
                  toggleDropdown();
                }}
              >
                Complain about Theater
              </button>
            </div>
          )}
        </div>
        {complaintType === "movie" && (
          <div>
            <h3>
              Complaint about Movie: {bookingDetails?.ShowTime_ID.M_ID.M_Name}
            </h3>
            <form
              className="MBComplaintForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleComplaintSubmit();
              }}
            >
              <label>
                Complaint Description: <br />
                <textarea
                  className="MBComplaintArea"
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </label>
              <div className="dropDownCloseSubBtnWrapper">
                <button className="dropDownCloseSubBtn" type="submit">
                  Submit
                </button>
                <button
                  className="dropDownCloseSubBtn"
                  onClick={() => setComplaintType(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
        {complaintType === "theater" && (
          <div>
            <h3>
              Complaint about Theater:{" "}
              {bookingDetails?.ShowTime_ID.Screen_M.T_ID.T_Name}
            </h3>
            <form
              className="MBComplaintForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleComplaintSubmit();
              }}
            >
              <label>
                Complaint Description: <br />
                <textarea
                  className="MBComplaintArea"
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </label>
              <div className="dropDownCloseSubBtnWrapper">
                <button className="dropDownCloseSubBtn" type="submit">
                  Submit
                </button>
                <button
                  className="dropDownCloseSubBtn"
                  onClick={() => setComplaintType(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingDetails;
*/