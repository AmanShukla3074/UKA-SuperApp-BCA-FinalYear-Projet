import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";
import "./Wishlist.css";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [data, setData] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/EC/wishlist/",
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMusicData();
  }, []);

  return (
    <div>
      <div className="wishlistWarpper">
        <h1>Your Wishlist</h1>
        <div className="products">
          {data.map((item) => (
            <Link
              to={`/ecommerce/product/${item.P_ID.P_ID}`}
              className="product-item-link"
              key={item.P_ID.P_ID}
            >
              <div className="item" key={item.P_ID.P_ID}>
                <div className="img">
                  {item.P_ID.Images && item.P_ID.Images.length > 0 && (
                    <img
                      src={`http://127.0.0.1:8000${item.P_ID.Images[0].img}`}
                      alt="Product"
                    />
                  )}
                </div>
                <div className="name">{item.P_ID.P_Name}</div>
                <div className="price">{item.P_ID.P_Price}</div>
                <div className="sizes">
                  {item.P_ID.Size &&
                    item.P_ID.Size.map((sizeItem) => (
                      <span className="size" key={sizeItem.P_Size_ID}>
                        {sizeItem.size.Size_Name}{" "}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
