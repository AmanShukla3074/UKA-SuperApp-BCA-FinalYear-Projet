import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import uka_logo from "../Assets/uka_logo2.png";
import { CgProfile } from "react-icons/cg";
import AuthContext from "../../Context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const { user, logoutUser } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setNavbarTransparent(false);
      } else {
        setNavbarTransparent(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    const handlePathChange = () => {
      setDropdownVisible(false); // Close dropdown when path changes
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);

  const isEChomeRoute =
    location.pathname === "/ecommerce/home" ||
    location.pathname === "/" ||
    location.pathname === "/ecommerce";

  const openAdminPanel = () => {
    window.open("http://127.0.0.1:8000/admin/", "_blank");
  };

  return (
    <nav
      className={`navbar ${
        navbarTransparent && isEChomeRoute ? "transparent" : "solid"
      }`}
    >
      <div className="logo">
        <NavLink to="/">
          <img src={uka_logo} alt="Logo" />
        </NavLink>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/ecommerce">Ecommerce</NavLink>
        </li>
        <li>
          <NavLink to="/moviebooking">Movie Booking</NavLink>
        </li>
        <li>
          <NavLink to="/musicstreaming">Music Streaming</NavLink>
        </li>
        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact US</NavLink>
        </li>
        {user && user.Role === "Admin" && (
          <li onClick={openAdminPanel} className="adminPanel">Admin Panel</li>
        )}
        {user && user.Role === "Delivery Person" && (
          <li>
            <NavLink to="/deliverypanel">Delivery Person Panel</NavLink>
          </li>
        )}
        {user && user.Role === "Theater Manager" && (
          <li>
            <NavLink to="/theaterpanel">Theater Manager Panel</NavLink>
          </li>
        )}
      </ul>
      <div className="user-actions">
        {user ? (
          <>
            <button className="profile-btn" onClick={toggleDropdown}>
              <CgProfile />
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <ul>
                  <li>{user.username}</li>
                  <br />
                  {/* <li>Profile</li> */}
                  {/* <li>
                    <a
                      href="http://127.0.0.1:8000/admin/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Admin Panel
                    </a>
                  </li> */}

                  <Link to="/changepassword" className="LinkTextDeco">
                    <li>Change Password</li>
                  </Link>
                  <Link to="/ecommerce/orderlist" className="LinkTextDeco">
                    <li>My Orders</li>
                  </Link>
                  <Link to="/moviebooking/bookings" className="LinkTextDeco">
                    <li>My Ticket Bookings</li>
                  </Link>
                  <li onClick={logoutUser}>Logout</li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import "./Navbar.css";
// import uka_logo from "../Assets/uka_logo2.png";
// import { CgProfile } from "react-icons/cg";
// import AuthContext from "../../Context/AuthContext";

// const Navbar = () => {
//   const location = useLocation();
//   const [navbarTransparent, setNavbarTransparent] = useState(true);
//   const { user, logoutUser } = useContext(AuthContext);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;
//       if (scrollPosition > 50) {
//         setNavbarTransparent(false);
//       } else {
//         setNavbarTransparent(true);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownVisible(false);
//       }
//     };

//     const handlePathChange = () => {
//       setDropdownVisible(false); // Close dropdown when path changes
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };
//   useEffect(() => {
//     setDropdownVisible(false);
//   }, [location]);

//   const isEChomeRoute =
//     location.pathname === "/ecommerce/home" ||
//     location.pathname === "/" ||
//     location.pathname === "/ecommerce";

//   const openAdminPanel = () => {
//     window.open("http://127.0.0.1:8000/admin/", "_blank");
//   };

//   return (
//     <nav
//       className={`navbar ${
//         navbarTransparent && isEChomeRoute ? "transparent" : "solid"
//       }`}
//     >
//       <div className="logo">
//         <NavLink to="/">
//           <img src={uka_logo} alt="Logo" />
//         </NavLink>
//       </div>
//       <ul className="nav-links">
//         <li>
//           <NavLink to="/ecommerce">Ecommerce</NavLink>
//         </li>
//         <li>
//           <NavLink to="/moviebooking">Movie Booking</NavLink>
//         </li>
//         <li>
//           <NavLink to="/musicstreaming">Music Streaming</NavLink>
//         </li>
//         <li>
//           <NavLink to="/about">About Us</NavLink>
//         </li>
//         <li>
//           <NavLink to="/contact">Contact US</NavLink>
//         </li>
//         {user && user.Role === "Admin" && (
//           <li onClick={openAdminPanel} className="adminPanel">Admin Panel</li>
//         )}
//       </ul>
//       <div className="user-actions">
//         {user ? (
//           <>
//             <button className="profile-btn" onClick={toggleDropdown}>
//               <CgProfile />
//             </button>
//             {dropdownVisible && (
//               <div className="dropdown-menu" ref={dropdownRef}>
//                 <ul>
//                   <li>{user.username}</li>
//                   <br />
//                   {/* <li>Profile</li> */}
//                   {/* <li>
//                     <a
//                       href="http://127.0.0.1:8000/admin/"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Admin Panel
//                     </a>
//                   </li> */}

//                   <Link to="/changepassword" className="LinkTextDeco">
//                     <li>Change Password</li>
//                   </Link>
//                   <Link to="/ecommerce/orderlist" className="LinkTextDeco">
//                     <li>My Orders</li>
//                   </Link>
//                   <Link to="/moviebooking/bookings" className="LinkTextDeco">
//                     <li>My Ticket Bookings</li>
//                   </Link>
//                   <li onClick={logoutUser}>Logout</li>
//                 </ul>
//               </div>
//             )}
//           </>
//         ) : (
//           <Link to="/login">
//             <button className="login-btn">Login</button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
