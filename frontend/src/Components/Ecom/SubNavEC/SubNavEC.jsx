import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaTimes, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SubNavEC.css";

function SubNavEC() {
  const [subnavSolid, setSubnavSolid] = useState(true);
  const [isSearchBoxVisible, setSearchBoxVisibility] = useState(false);
  const [menu, setMenu] = useState("Home");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setSubnavSolid(window.scrollY <= 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSearchBox = () => {
    setSearchBoxVisibility(!isSearchBoxVisible);
  };

  const location = useLocation();

  useEffect(() => {
    if (!isSearchBoxVisible) {
      setSearchResults([]);
      setSearchQuery("");
      setSearchBoxVisibility(false);
    }
  }, [isSearchBoxVisible]);

  const isEChomeRoute =
    location.pathname === "/ecommerce/home" ||
    location.pathname === "/ecommerce";

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
        `http://127.0.0.1:8000/api/EC/search?query=${encodeURIComponent(
          searchQuery
        )}`
      )
        .then((response) => response.json())
        .then((data) => setSearchResults(data.products))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    }
  }, 500);

  useEffect(() => {
    // console.log(searchResults); 
  }, [searchResults]);

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery]);

  // console.log("Rendering search results:", searchResults); 

  return (
    <div
      className={`sub-nav ${
        subnavSolid && isEChomeRoute ? " transparent" : "solid"
      }`}
    >
      <nav>
        <div className="wapperNav">
          <ul className="left-side">
            <li
              className={menu === "Home" ? "active" : ""}
              onClick={() => {
                setMenu("Home");
              }}
            >
              <Link to="/ecommerce/home">Home</Link>
            </li>
            <li
              className={menu === "Hoodie" ? "active" : ""}
              onClick={() => {
                setMenu("Hoodie");
              }}
            >
              <Link to="/ecommerce/Hoodie">Hoodie</Link>
            </li>
            <li
              className={menu === "Sweatshirts" ? "active" : ""}
              onClick={() => {
                setMenu("Sweatshirts");
              }}
            >
              <Link to="/ecommerce/Sweatshirts">Sweatshirts</Link>
            </li>
            {/* <li
              className={menu === "Tees" ? "active" : ""}
              onClick={() => {
                setMenu("Tees");
              }}
            >
              <Link to="/ecommerce/Tees">Tees</Link>
            </li> */}
            <li
              className={menu === "Caps" ? "active" : ""}
              onClick={() => {
                setMenu("Caps");
              }}
            >
              <Link to="/ecommerce/Caps">Caps</Link>
            </li>
            <li
              className={menu === "Jeans" ? "active" : ""}
              onClick={() => {
                setMenu("Jeans");
              }}
            >
              <Link to="/ecommerce/Jeans">Jeans</Link>
            </li>
            <li
              className={menu === "Shoes" ? "active" : ""}
              onClick={() => {
                setMenu("Shoes");
              }}
            >
              <Link to="/ecommerce/Shoes">Shoes</Link>
            </li>
          </ul>
          <ul className="right-side">
            <li>
              <Link to="cart">
                <FaShoppingCart />
              </Link>
            </li>
            <li>
              <Link to="wishlist">
                <FaHeart />
              </Link>
            </li>
            <li>
              <button className="search-btn-icon" onClick={toggleSearchBox}>
                {isSearchBoxVisible ? <FaTimes /> : <FaSearch />}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className={`search-box-ec ${isSearchBoxVisible ? "visible" : ""}`}>
        {isSearchBoxVisible && (
          <>
            <input
              type="text"
              placeholder="Search..."
              className="search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="search-results-ec">
          {searchResults.map((product, index) => (
            <div
              key={index}
              className="search-result-ec"
              onClick={() => {
                navigate(`/ecommerce/product/${product.P_ID}`);
                setSearchResults([]);
                setSearchQuery("");
                setSearchBoxVisibility(false);
              }}
            >
              <div className="product-image-ec-container">
                <img
                  src={`http://127.0.0.1:8000${product.Images[0].img}`}
                  alt={product.P_Name}
                  className="product-image-ec"
                />
              </div>
              <div className="product-details-ec">
                <h3>{product.P_Name}</h3>
                <p>{product.P_Price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubNavEC;
