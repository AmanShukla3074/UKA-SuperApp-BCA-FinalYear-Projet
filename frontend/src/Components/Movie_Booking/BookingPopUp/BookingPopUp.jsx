import React from "react";
import {  useNavigate } from "react-router-dom";
import "./BookingPopUp.css";

// const BookingPopUp = ({ show, onClose, movieId, sortedData }) => {
//   if (!show || !sortedData) return null;
const BookingPopUp = ({ show, onClose, movieId, sortedData }) => {
  const navigate = useNavigate()
  // console.log("show:", show);
  // console.log("movieId:", movieId);
  // console.log("sortedData:", sortedData);

  if (!show || !sortedData) {
    // console.log("Returning null");
    return null;
  }

  const handleShowtimeClick = (languageID, typeID) => {
    const movieType =
      sortedData[languageID]?.[typeID]?.[0]?.M_Type?.Type_ID || "";
    const movieLang =
      sortedData[languageID]?.[typeID]?.[0]?.M_Language?.Language_ID || "";

    // Construct the URL with the selected parameters
    // const showtimesURL = `/moviebooking/showtimes/${movieId}/${encodeURIComponent(movieType)}/${encodeURIComponent(movieLang)}`;
    const showtimesURL = `/moviebooking/showtimes/${movieId}/${movieType}/${movieLang}`;
    // Navigate to the showtimes route
    // window.location.href = showtimesURL;
    navigate(showtimesURL);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="btnHeader">
        <h3 className="headerH3">Select Language And Format</h3>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        </div>
        <div className="modal-content-movie">
          {Object.entries(sortedData).map(([languageID, languageGroup]) => (
            <div key={languageID} className="modal-language">
              <h3>
                {languageGroup[0]?.[0]?.M_Language?.Language_Name ||
                  languageGroup[1]?.[0]?.M_Language?.Language_Name}
              </h3>
              <ul className="showtypes">
                {Object.entries(languageGroup).map(([typeID, showTypeGroup]) => (
                  <div key={typeID} className="modal-showtype">
                    <button className="showTypeBtn" onClick={() => handleShowtimeClick(languageID, typeID)}>
                      {showTypeGroup[0] &&
                        showTypeGroup[0].M_Type &&
                        showTypeGroup[0].M_Type.Type_Name}
                    </button>
  
                  </div>
                  // <div key={typeID} className="modal-showtype">
                  //   <h4>
                  //     {showTypeGroup[0] &&
                  //       showTypeGroup[0].M_Type &&
                  //       showTypeGroup[0].M_Type.Type_Name}
                  //   </h4>
                  //   <button
                  //     onClick={() => handleShowtimeClick(languageID, typeID)}
                  //   >
                  //     Book Now
                  //   </button>
                  // </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPopUp;




// import React from "react";
// import './BookingPopUp.css'
// const BookingPopUp = ({ show, onClose, children }) => {
//   if (!show) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <button className="modal-close-button" onClick={onClose}>
//           &times;
//         </button>
//         <div className="modal-content">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default BookingPopUp;