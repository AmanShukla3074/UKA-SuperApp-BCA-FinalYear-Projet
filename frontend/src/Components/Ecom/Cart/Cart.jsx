import React from "react";
import "./Cart.css";
import { MenuContext } from "../../../Context/MenuContext";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { MdDelete } from "react-icons/md";
import Notification from "../../Notification/Notification";

const Cart = () => {
  const { addToCart, removeFromCart, cartItems } = useContext(MenuContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");
  const [data, setData] = useState({
    cart: {},
    cart_items: [], // Initialize as an empty array
    menus: [], // Initialize as an empty array
    message: "",
  });

  const [cartCounts1, setCartCounts1] = useState({});
  useEffect(() => {}, [cartCounts1]);

  const handleIncrement = async (event, cart_items) => {
    event.preventDefault();
    const updatedCounts = {
      ...cartCounts1,
      [cart_items.CartDetailsID]:
        (cartCounts1[cart_items.CartDetailsID] || cart_items.ItemQuantity) + 1,
    };
    setCartCounts1(updatedCounts);

    try {
      const accessToken = localStorage.getItem("authTokens");
      const { access } = JSON.parse(accessToken);
      const updatedQuantity = (cart_items.ItemQuantity || 0) + 1;

      // Include Size_ID in the request body
      await axios.put(
        `http://127.0.0.1:8000/api/EC/cart/`,
        {
          Cart_Item_ID: cart_items.CartDetailsID,
          ItemQuantity: updatedQuantity,
          Cart_ID: data.cart.CartID,
          P_ID: cart_items.P_ID,
          Size_ID: cart_items.Size_ID, // Include Size_ID
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Fetch updated cart data after increment operation
      const response = await axios.get("http://127.0.0.1:8000/api/EC/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("authTokens");
        const { access } = JSON.parse(accessToken);

        const response = await axios.get("http://127.0.0.1:8000/api/EC/cart/", {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleDecrement = async (cart_items, itemId) => {
    setCartCounts1((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [cart_items.CartDetailsID]: Math.max(
          0,
          (prevCounts[cart_items.CartDetailsID] || 0) - 1
        ),
      };
      return updatedCounts;
    });

    try {
      const accessToken = localStorage.getItem("authTokens");
      const { access } = JSON.parse(accessToken);
      const updatedQuantity = Math.max(0, (cart_items.ItemQuantity || 0) - 1);

      await axios.patch(
        `http://127.0.0.1:8000/api/EC/cart/`,
        {
          Cart_Item_ID: cart_items.CartDetailsID,
          ItemQuantity: updatedQuantity,
          Cart_ID: data.cart.CartID,
          P_ID: cart_items.P_ID,
        },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Fetch updated cart data after decrement operation
      const response = await axios.get("http://127.0.0.1:8000/api/EC/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleDelete = async (itemId) => {
    const accessToken = localStorage.getItem("authTokens");
    const { access } = JSON.parse(accessToken);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/EC/cart1/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Item deleted successfully");
      // Fetch updated cart data after delete operation
      const response = await axios.get("http://127.0.0.1:8000/api/EC/cart/", {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data); // Update the data state with the fetched data
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };
  const handleCheckout = async () => {
    try {
       const accessToken = localStorage.getItem("authTokens");
       const { access } = JSON.parse(accessToken);
   
       // Step 1: Fetch user's addresses
       const addressResponse = await axios.get("http://127.0.0.1:8000/api/Auth/register/address/", {
         headers: {
           Authorization: `Bearer ${access}`,
           "Content-Type": "application/json",
         },
       });
   
       // Step 2: Select the first address if there are more than two
       let selectedAddressId;
       if (addressResponse.data.length > 2) {
         selectedAddressId = addressResponse.data[0].AddressID;
       } else if (addressResponse.data.length > 0) {
         selectedAddressId = addressResponse.data[0].AddressID;
       } else {
         // Handle the case where no addresses are available
         console.error("No addresses available for the user.");
         return; // Exit the function if no addresses are available
       }
   
       // Step 3: Use the selected address ID in the order request body
       const requestBody = {
         Status_ID: 2,
         Address_ID: selectedAddressId, // Use the selected address ID here
       };
   
       const response = await axios.post(
         "http://127.0.0.1:8000/api/EC/order/",
         requestBody,
         {
           headers: {
             Authorization: `Bearer ${access}`,
             "Content-Type": "application/json",
           },
         }
       );
   
       setNotificationMessage("Checkout successfully done.");
       setNotificationColor("green");
       setShowNotification(true);
   
       setTimeout(() => {
         setShowNotification(false);
       }, 3000);
   
       const cartResponse = await axios.get(
         "http://127.0.0.1:8000/api/EC/cart/",
         {
           headers: {
             Authorization: `Bearer ${access}`,
             "Content-Type": "application/json",
           },
         }
       );
   
       setData(cartResponse.data);
    } catch (error) {
       console.error("Error during checkout:", error);
       // If the checkout fails, show a failure notification
       setNotificationMessage("Checkout failed. Please try again.");
       setNotificationColor("red");
       setShowNotification(true);
   
       // Optionally, hide the notification after a delay
       setTimeout(() => {
         setShowNotification(false);
       }, 3000);
   
       console.error("Error during checkout:", error);
       if (error.response) {
         console.log("Error Status:", error.response.status);
         console.log("Error Headers:", error.response.headers);
       } else if (error.request) {
         console.log("Error Request:", error.request);
       } else {
         console.log("Error Message:", error.message);
       }
    }
   };
   

  // const handleCheckout = async () => {
  //   try {
  //     const accessToken = localStorage.getItem("authTokens");
  //     const { access } = JSON.parse(accessToken);

  //     // Include the specified request body
  //     const requestBody = {
  //       Status_ID: 2,
  //       Address_ID:1,
  //     };

  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/EC/order/",
  //       requestBody,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     setNotificationMessage("Checkout successfully done.");
  //     setNotificationColor("green");
  //     setShowNotification(true);

  //     setTimeout(() => {
  //       setShowNotification(false);
  //     }, 3000); 

  //     const cartResponse = await axios.get(
  //       "http://127.0.0.1:8000/api/EC/cart/",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${access}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     setData(cartResponse.data);
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     // If the checkout fails, show a failure notification
  //     setNotificationMessage("Checkout failed. Please try again.");
  //     setNotificationColor("red");
  //     setShowNotification(true);

  //     // Optionally, hide the notification after a delay
  //     setTimeout(() => {
  //       setShowNotification(false);
  //     }, 3000);

  //     console.error("Error during checkout:", error);
  //     if (error.response) {
  //       console.log("Error Status:", error.response.status);
  //       console.log("Error Headers:", error.response.headers);
  //     } else if (error.request) {
  //       console.log("Error Request:", error.request);
  //     } else {
  //       console.log("Error Message:", error.message);
  //     }
  //   }
  // };
 
  return (
    <>
      {showNotification && (
        <Notification message={notificationMessage} color={notificationColor} />
      )}
      <div className="cart">
        {data.cart_items.map((cartItem) => {
          const product = data.menus.find(
            (menu) => menu.P_ID === cartItem.P_ID
          );

          // Check if the product and its images exist
          const productImages = product && product.Images ? product.Images : [];
          // const sizeName = product.Size.find(size => size.P_Size_ID === cartItem.Size_ID)?.size.Size_Name || 'N/A';

          const sizeName =
            product.Size.find((size) => size.size.Size_ID === cartItem.Size_ID)
              ?.size.Size_Name || "N/A";

          // console.log("Size Name:", sizeName); // This will log the Size Name corresponding to the Size_ID in the cart item

          return (
            <div key={cartItem.CartDetailsID} className="cartItem">
              <div className="cartImg">
                <img
                  src={`http://127.0.0.1:8000${productImages[0]?.img}`}
                  alt={product?.P_Name}
                />
              </div>
              <div className="cartDescription">
                <p className="cartItemHeader">{product?.P_Name}</p>
                <p className="cartItemSize">Size: {sizeName}</p>{" "}
                {/* Display the selected size */}
                <div className="cartBtns">
                  {/* <button
                    onClick={(event) => handleIncrement(event, cartItem)}
                    className="plusMinusBtn"
                  >
                    +
                  </button> */}
                  <button
                    onClick={() =>
                      handleDecrement(cartItem, cartItem.CartDetailsID)
                    }
                    className="plusMinusBtn"
                  >
                    -
                  </button>
                  <p className="qtyNumber">
                    {cartCounts1[cartItem.CartDetailsID] ||
                      cartItem.ItemQuantity}
                  </p>
                  <button
                    onClick={(event) => handleIncrement(event, cartItem)}
                    className="plusMinusBtn"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(cartItem.CartDetailsID)}
                    className="deleteBtn"
                  >
                    <MdDelete />
                  </button>
                </div>
                <p className="cartItemSubtot">Subtotal: {cartItem.Subtotal}</p>
              </div>
            </div>
          );
        })}{" "}
      </div>
      <div className="checkout">
        <h2>
          Total Amount: {"\u20B9"} {data.cart.Total}
        </h2>
        <div className="checkoutButtonWrap">
          <button
            onClick={handleCheckout}
            className="checkoutButton"
            disabled={data.cart_items.length === 0}
          >
            Checkout
          </button>

          {/* <button onClick={handleCheckout} className="checkoutButton">Checkout</button> */}
        </div>
      </div>
    </>
  );
};
export default Cart;
