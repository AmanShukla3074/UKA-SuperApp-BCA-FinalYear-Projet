import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Showtimes.css";
import { useNavigate, useParams } from "react-router-dom";

const Showtimes = () => {
 const [showtimes, setShowtimes] = useState([]);
 const [movieData, setMovieData] = useState([]);
 const [uniqueDates, setUniqueDates] = useState([]);
 const [selectedDate, setSelectedDate] = useState(null);
 const [filteredShowtimes, setFilteredShowtimes] = useState([]);
 const { movieId, movieType, movieLang } = useParams();
 const [uniqueTheaters, setUniqueTheaters] = useState({});
 const navigate = useNavigate();

 useEffect(() => {
  const fetchShowtimes = async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/Movie/showtimes/`,
        {
          params: {
            movie_type: movieType,
            language: movieLang,
            movie: movieId,
          },
        }
      );
      setShowtimes(response.data);
  
      const uniqueDatesArray = Array.from(
        new Set(response.data.map((showtime) => showtime.Date))
      );
  
      const uniqueTheatersObject = response.data.reduce((acc, showtime) => {
        const theaterId = showtime.Screen_M.T_ID.T_ID;
        const theaterDetails = showtime.Screen_M.T_ID;
  
        if (!acc[theaterId]) {
          acc[theaterId] = {
            theaterDetails,
            showtimes: [showtime],
          };
        } else {
          acc[theaterId].showtimes.push(showtime);
        }
  
        return acc;
      }, {});
  
      setUniqueTheaters(uniqueTheatersObject);
      setUniqueDates(uniqueDatesArray);
  
      // Get today's date in the same format as the dates in the array
      const today = new Date().toISOString().split("T")[0];
  
      // Filter out dates that are before today
      const futureDatesArray = uniqueDatesArray.filter(date => new Date(date) >= new Date(today));
  
      // Sort the future dates
      const sortedFutureDates = futureDatesArray.sort(
        (a, b) => new Date(a) - new Date(b)
      );
      console.log("Sorted Future Dates:", sortedFutureDates); // Log the sorted future dates
  
      // Find the first future date with showtimes
      const firstFutureDateWithShowtimes = sortedFutureDates.find(date => {
        const showtimesForDate = showtimes.filter(showtime => showtime.Date === date);
        return showtimesForDate.length > 0;
      });
  
      // Ensure a date is selected if available
      setSelectedDate(firstFutureDateWithShowtimes || today); // Default to today if no future date with showtimes
  };
  
  fetchShowtimes();
  }, []); // Empty dependency array ensures this effect runs only once
 
 useEffect(() => {
    if (selectedDate) {
      handleDateChange(null, selectedDate);
    }
 }, [selectedDate]);

 const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
 };

 const handleDateChange = (event, date) => {
    event && event.preventDefault();
    date && setSelectedDate(date);

    const selectedDateObj = new Date(date);
    console.log("Selected Date:", selectedDateObj.toISOString().split("T")[0]);

    const filteredShowtimes = showtimes.filter((showtime) => {
      const showtimeDateObj = new Date(showtime.Date);
      const isMatch = isSameDate(selectedDateObj, showtimeDateObj);
      console.log(
        `Showtime Date: ${
          showtimeDateObj.toISOString().split("T")[0]
        }, Match: ${isMatch}`
      );
      return isMatch;
    });

    console.log("Filtered Showtimes:", filteredShowtimes);
    setFilteredShowtimes(filteredShowtimes);
 };

 const formatTime = (timeString) => {
    const formattedTime = new Date(
      `1970-01-01T${timeString}`
    ).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
 };

 return (
    <div className="showtimeswrapper">
      <div className="showtimes">
        <div className="movieDetails">
          <p className="movieName">{movieData.M_Name}</p>
        </div>
        <div className="showtimeDates">
          <div className="showtime-container">
            <h2>Showtimes</h2>
          </div>

          <div className="date-list">
            {uniqueDates
              .sort((a, b) => new Date(a) - new Date(b)) // Ensure dates are sorted
              .filter((date) => {
                // Include today's date and future dates with showtimes
                const isFutureDateWithShowtimes = showtimes.some(showtime => 
                 new Date(showtime.Date).toISOString().split("T")[0] === date && 
                 new Date(date) >= new Date().setHours(0, 0, 0, 0)
                );
                return isFutureDateWithShowtimes;
              })
              .map((date) => (
                <div
                 key={date}
                 className={`date-item-showtime${selectedDate === date ? " selected" : ""}`}
                 onClick={(event) => handleDateChange(event, date)}
                >
                 <h3>{new Date(date).toLocaleDateString("en-GB")}</h3>
                </div>
              ))}
          </div>

          <div className="theater-list">
            {Object.values(uniqueTheaters)
              .filter(({ showtimes }) =>
                showtimes.some((showtime) =>
                 isSameDate(new Date(selectedDate), new Date(showtime.Date))
                )
              )
              .map(({ theaterDetails, showtimes }) => (
                <div key={theaterDetails.T_ID} className="theater-item">
                 <h3 className="theaterName">{theaterDetails.T_Name}</h3>
                 <div className="showtime-details">
                    {showtimes
                      .filter((showtime) =>
                        isSameDate(
                          new Date(selectedDate),
                          new Date(showtime.Date)
                        )
                      )
                      .map((showtime) => (
                        <div
                          key={showtime.ShowTime_ID}
                          className="showtime-item-shows"
                          onClick={() =>
                            navigate(
                              `/moviebooking/showtime-seat/${showtime.ShowTime_ID}`
                            )
                          }
                        >
                          <p className="timing">
                            {formatTime(showtime.StartTime)}
                          </p>
                        </div>
                      ))}
                 </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
 );
};

export default Showtimes;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Showtimes.css";
// import { useNavigate, useParams } from "react-router-dom";

// const Showtimes = () => {
//  const [showtimes, setShowtimes] = useState([]);
//  const [movieData, setMovieData] = useState([]);
//  const [uniqueDates, setUniqueDates] = useState([]);
//  const [selectedDate, setSelectedDate] = useState(null);
//  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
//  const { movieId, movieType, movieLang } = useParams();
//  const [uniqueTheaters, setUniqueTheaters] = useState({});
//  const navigate = useNavigate();

// //  useEffect(() => {
// //     const fetchShowtimes = async () => {
// //       const response = await axios.get(
// //         `http://127.0.0.1:8000/api/Movie/showtimes/?movie_type=${movieType}&language=${movieLang}&movie=${movieId}`
// //       );
// //       setShowtimes(response.data);

// //       const uniqueDatesArray = Array.from(
// //         new Set(response.data.map((showtime) => showtime.Date))
// //       );

// //       const uniqueTheatersObject = response.data.reduce((acc, showtime) => {
// //         const theaterId = showtime.Screen_M.T_ID.T_ID;
// //         const theaterDetails = showtime.Screen_M.T_ID;

// //         if (!acc[theaterId]) {
// //           acc[theaterId] = {
// //             theaterDetails,
// //             showtimes: [showtime],
// //           };
// //         } else {
// //           acc[theaterId].showtimes.push(showtime);
// //         }

// //         return acc;
// //       }, {});
// //       console.log(showtimes);
// //       setUniqueTheaters(uniqueTheatersObject);
// //       setUniqueDates(uniqueDatesArray);

// //       // Adjusted logic to ensure the first future date is selected
// //       const sortedUniqueDates = uniqueDatesArray.sort(
// //         (a, b) => new Date(a) - new Date(b)
// //       );
// //       const firstFutureDate = sortedUniqueDates.find(
// //         (date) => new Date(date) >= new Date()
// //       );
// //       setSelectedDate(firstFutureDate);
// //     };

// //     fetchShowtimes();
// //  }, [movieId, movieType, movieLang]);
// useEffect(() => {
//   const fetchShowtimes = async () => {
//      const response = await axios.get(
//        `http://127.0.0.1:8000/api/Movie/showtimes/?movie_type=${movieType}&language=${movieLang}&movie=${movieId}`
//      );
//      setShowtimes(response.data);
 
//      const uniqueDatesArray = Array.from(
//        new Set(response.data.map((showtime) => showtime.Date))
//      );
 
//      const uniqueTheatersObject = response.data.reduce((acc, showtime) => {
//        const theaterId = showtime.Screen_M.T_ID.T_ID;
//        const theaterDetails = showtime.Screen_M.T_ID;
 
//        if (!acc[theaterId]) {
//          acc[theaterId] = {
//            theaterDetails,
//            showtimes: [showtime],
//          };
//        } else {
//          acc[theaterId].showtimes.push(showtime);
//        }
 
//        return acc;
//      }, {});
 
//      setUniqueTheaters(uniqueTheatersObject);
//      setUniqueDates(uniqueDatesArray);
 
//      // Corrected logic to ensure the first future date with showtimes is selected
//      const sortedUniqueDates = uniqueDatesArray.sort(
//        (a, b) => new Date(a) - new Date(b)
//      );
//      const firstFutureDateWithShowtimes = sortedUniqueDates.find(date => {
//        // Check if there are any showtimes for this date
//        const showtimesForDate = showtimes.filter(showtime => new Date(showtime.Date).toISOString().split("T")[0] === date);
//        return showtimesForDate.length > 0 && new Date(date) > new Date(); // Ensure it's a future date
//      });
 
//      // Ensure a date is selected if available
//      setSelectedDate(firstFutureDateWithShowtimes || uniqueDatesArray[0]);
//   };
 
//   fetchShowtimes();
//  }, [movieId, movieType, movieLang]);
 

//  useEffect(() => {
//     if (selectedDate) {
//       handleDateChange(null, selectedDate);
//     }
//  }, [selectedDate]);

//  const isSameDate = (date1, date2) => {
//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//  };

//  const handleDateChange = (event, date) => {
//     event && event.preventDefault();
//     date && setSelectedDate(date);

//     const selectedDateObj = new Date(date);
//     console.log("Selected Date:", selectedDateObj.toISOString().split("T")[0]);

//     const filteredShowtimes = showtimes.filter((showtime) => {
//       const showtimeDateObj = new Date(showtime.Date);
//       const isMatch = isSameDate(selectedDateObj, showtimeDateObj);
//       console.log(
//         `Showtime Date: ${
//           showtimeDateObj.toISOString().split("T")[0]
//         }, Match: ${isMatch}`
//       );
//       return isMatch;
//     });

//     console.log("Filtered Showtimes:", filteredShowtimes);
//     setFilteredShowtimes(filteredShowtimes);
//  };

//  const formatTime = (timeString) => {
//     const formattedTime = new Date(
//       `1970-01-01T${timeString}`
//     ).toLocaleTimeString([], {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//     return formattedTime;
//  };

//  return (
//     <div className="showtimeswrapper">
//       <div className="showtimes">
//         <div className="movieDetails">
//           <p className="movieName">{movieData.M_Name}</p>
//         </div>
//         <div className="showtimeDates">
//           <div className="showtime-container">
//             <h2>Showtimes</h2>
//           </div>
        
// <div className="date-list">
//  {uniqueDates
//     .sort((a, b) => new Date(a) - new Date(b)) // Ensure dates are sorted
//     .filter((date) => new Date(date) >= new Date().setHours(0, 0, 0, 0)) // Include today's date
//     .map((date) => (
//       <div
//         key={date}
//         className={`date-item${selectedDate === date ? " selected" : ""}`}
//         onClick={(event) => handleDateChange(event, date)}
//       >
//         <h3>{new Date(date).toLocaleDateString("en-GB")}</h3>
//       </div>
//     ))}
// </div>

//           <div className="theater-list">
//             {Object.values(uniqueTheaters)
//               .filter(({ showtimes }) =>
//                 showtimes.some((showtime) =>
//                  isSameDate(new Date(selectedDate), new Date(showtime.Date))
//                 )
//               )
//               .map(({ theaterDetails, showtimes }) => (
//                 <div key={theaterDetails.T_ID} className="theater-item">
//                  <h3>{theaterDetails.T_Name}</h3>
//                  <div className="showtime-details">
//                     {showtimes
//                       .filter((showtime) =>
//                         isSameDate(
//                           new Date(selectedDate),
//                           new Date(showtime.Date)
//                         )
//                       )
//                       .map((showtime) => (
//                         <div
//                           key={showtime.ShowTime_ID}
//                           className="showtime-item"
//                           onClick={() =>
//                             navigate(
//                               `/moviebooking/showtime-seat/${showtime.ShowTime_ID}`
//                             )
//                           }
//                         >
//                           <p className="timing">
//                             {formatTime(showtime.StartTime)}
//                           </p>
//                         </div>
//                       ))}
//                  </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//  );
// };

// export default Showtimes;
