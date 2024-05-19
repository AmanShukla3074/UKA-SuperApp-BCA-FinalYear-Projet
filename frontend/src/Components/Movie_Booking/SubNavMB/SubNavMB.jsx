import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import './SubNavMB.css'; // Ensure this CSS file contains the necessary styles for the "active" class

function SubNavMB() {
 const [isSearchBoxVisible, setSearchBoxVisibility] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const [menu, setMenu] = useState("Home"); // Set initial state to "Home"

 const navigate = useNavigate();
 const location = useLocation(); // Get the current location

 const toggleSearchBox = () => {
    setSearchBoxVisibility(!isSearchBoxVisible);
 };

 useEffect(() => {
    if (!isSearchBoxVisible) {
      setSearchResults([]);
      setSearchQuery("");
      setSearchBoxVisibility(false);
    }
 }, [isSearchBoxVisible]);

 const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
 };

 const debouncedSearch = debounce(() => {
    if (searchQuery) {
      fetch(
        `http://127.0.0.1:8000/api/Movie/movies/search?query=${encodeURIComponent(searchQuery)}`
      )
        .then((response) => response.json())
        .then((data) => setSearchResults(data.movies))
        .catch((error) => console.error("Error fetching search results:", error));
    }
 }, 500);

 useEffect(() => {
    debouncedSearch();
 }, [searchQuery]);

 return (
    <>
      <div className={`Sub-Nav`}>
        <nav className='mbnav'>
          <div className="wapperNav">
            <ul className="left-side">
              <li className={menu === "Home" ? "active" : ""} onClick={() => setMenu("Home")}>
                <Link to="/moviebooking/home">Home</Link>
              </li>
              <li className={menu === "Movies" ? "active" : ""} onClick={() => setMenu("Movies")}>
                <Link to="/moviebooking/movies">Movies</Link>
              </li>
              {/* Add more list items as needed */}
            </ul>
            <ul className="right-side">
              <li>
                <button className="search-btn-icon" onClick={toggleSearchBox}>
                 {isSearchBoxVisible ? <FaTimes /> : <FaSearch />}
                </button>
              </li>
              {/* Add more list items as needed */}
            </ul>
          </div>
        </nav>
        {isSearchBoxVisible && (
          <div className={`search-box-ec ${isSearchBoxVisible ? 'visible' : ''}`}>
            <input
              type="text"
              placeholder="Search..."
              className="search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="search-results-ec">
            {searchResults.map((movie) => (
              <div
                key={movie.M_ID}
                className="search-result-ec"
                onClick={() => {
                 navigate(`/moviebooking/movie/${movie.M_ID}`);
                 setSearchResults([]);
                 setSearchQuery("");
                 setSearchBoxVisibility(false);
                }}
              >
                <div className="product-image-ec-container">
                 {movie.images && movie.images.length > 0 && (
                    <img
                      src={`http://127.0.0.1:8000${movie.images[0].img}`}
                      alt={movie.M_Name}
                      className="product-image-ec"
                    />
                 )}
                </div>
                <div className="product-details-ec">
                 <h3>{movie.M_Name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <Outlet /> Move it outside the 'nav' element */}
    </>
 );
}

export default SubNavMB;




// import React, { useState, useEffect } from 'react';
// import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// import { FaSearch, FaTimes } from 'react-icons/fa';
// import { MdLocationOn } from 'react-icons/md';
// import './SubNavMB.css';

// function SubNavMB() {
//  const [isSearchBoxVisible, setSearchBoxVisibility] = useState(false);
//  const [searchQuery, setSearchQuery] = useState("");
//  const [searchResults, setSearchResults] = useState([]);

//  const navigate = useNavigate();
//  const location = useLocation(); // Get the current location

//  const toggleSearchBox = () => {
//     setSearchBoxVisibility(!isSearchBoxVisible);
//  };

//  useEffect(() => {
//     if (!isSearchBoxVisible) {
//       setSearchResults([]);
//       setSearchQuery("");
//       setSearchBoxVisibility(false);
//     }
//  }, [isSearchBoxVisible]);

//  const debounce = (func, delay) => {
//     let debounceTimer;
//     return function () {
//       const context = this;
//       const args = arguments;
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(() => func.apply(context, args), delay);
//     };
//  };

//  const debouncedSearch = debounce(() => {
//     if (searchQuery) {
//       fetch(
//         `http://127.0.0.1:8000/api/Movie/movies/search?query=${encodeURIComponent(searchQuery)}`
//       )
//         .then((response) => response.json())
//         .then((data) => setSearchResults(data.movies))
//         .catch((error) => console.error("Error fetching search results:", error));
//     }
//  }, 500);

//  useEffect(() => {
//     debouncedSearch();
//  }, [searchQuery]);

//  return (
//     <>
//       <div className={`Sub-Nav`}>
//         <nav className='mbnav'>
//           <div className="wapperNav">
//             <ul className="left-side">
//               <li className={location.pathname === "/moviebooking/home" ? "active" : ""}>
//                 <Link to="/moviebooking/home">Home</Link>
//               </li>
//               <li className={location.pathname === "/moviebooking/movies" ? "active" : ""}>
//                 <Link to="/moviebooking/movies">Movies</Link>
//               </li>
//               {/* Add more list items as needed */}
//             </ul>
//             <ul className="right-side">
//               <li>
//                 <button className="search-btn-icon" onClick={toggleSearchBox}>
//                  {isSearchBoxVisible ? <FaTimes /> : <FaSearch />}
//                 </button>
//               </li>
//               {/* Add more list items as needed */}
//             </ul>
//           </div>
//         </nav>
//         {isSearchBoxVisible && (
//           <div className={`search-box-ec ${isSearchBoxVisible ? 'visible' : ''}`}>
//             <input
//               type="text"
//               placeholder="Search..."
//               className="search-field"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         )}
//         {searchResults.length > 0 && (
//           <div className="search-results-ec">
//             {searchResults.map((movie) => (
//               <div
//                 key={movie.M_ID}
//                 className="search-result-ec"
//                 onClick={() => {
//                  navigate(`/moviebooking/movie/${movie.M_ID}`);
//                  setSearchResults([]);
//                  setSearchQuery("");
//                  setSearchBoxVisibility(false);
//                 }}
//               >
//                 <div className="product-image-ec-container">
//                  {movie.images && movie.images.length > 0 && (
//                     <img
//                       src={`http://127.0.0.1:8000${movie.images[0].img}`}
//                       alt={movie.M_Name}
//                       className="product-image-ec"
//                     />
//                  )}
//                 </div>
//                 <div className="product-details-ec">
//                  <h3>{movie.M_Name}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* <Outlet /> Move it outside the 'nav' element */}
//     </>
//  );
// }

// export default SubNavMB;

