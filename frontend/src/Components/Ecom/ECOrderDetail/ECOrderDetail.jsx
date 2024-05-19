import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AuthContext from "../../../Context/AuthContext";
import "./ECOrderDetail.css";
import Notification from "../../Notification/Notification";

const ECOrderDetail = () => {
  const { orderdetailsId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [complaintDesc, setComplaintDesc] = useState("");
  const [isOrderCanceled, setIsOrderCanceled] = useState(false); // track if the order is canceled
  const [isOrderCancelable, setIsOrderCancelable] = useState(false); // track if the order is cancelable
  const { authTokens } = useContext(AuthContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/EC/order/${orderdetailsId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        if (response.status === 200) {

          const orderDate = new Date(response.data.OrderDate);
          const currentTime = new Date();
          const timeDiff = currentTime - orderDate;
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
          setIsOrderCancelable(hoursDiff < 24);

          setOrderDetails(response.data.order_details || []);
          setOrderInfo({
            totalAmount: response.data.Total,
            orderDate: response.data.OrderDate,
            orderStatus: response.data.Status_ID.Status_Name,
          });
          // Check if the order is canceled
          setIsOrderCanceled(response.data.Status_ID.Status_Name === "cancelled");
          // console.log(response.data);
          // console.log(isOrderCanceled);
        } else {
          throw new Error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderdetailsId, authTokens]);

  useEffect(() => {
    console.log("isOrderCanceled:", isOrderCanceled);
    console.log("isOrderCancelable:", isOrderCancelable);
  }, [isOrderCanceled, isOrderCancelable]);

  const renderCancellationInfo = () => {
    if (isOrderCanceled) {
      return (
        <div>
          <p>Order is canceled.</p>
          <button disabled className="cancel-order-button2">
            Order cancelled
          </button>
        </div>
      );
    } else if (!isOrderCancelable) {
      return (
        <div>
          <p>Order cannot be cancel after 24 hours.</p>
          <button disabled className="cancel-order-button2">
          Cancel Order
          </button>
        </div>
      );
    }
    return (
      <button onClick={handleCancelOrder} className="cancel-order-button">
        Cancel Order
      </button>
    );
  };


  if (!orderDetails.length) {
    return <div>Loading...</div>;
  }



  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/EC/ECcomplaints/`,
        {
          Order_ID: parseInt(orderdetailsId),
          Complaint_Desc: complaintDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      if (response.status === 201) {
        setNotificationMessage("Complaint Submitted");
        setNotificationColor("green");
        setShowNotification(true);
  
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
        setComplaintDesc(""); 
      } else {
        setNotificationMessage("Can't Submit Complaint");
        setNotificationColor("red");
        setShowNotification(true);
  
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
        setComplaintDesc(""); 
        throw new Error("Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      // alert("Failed to submit complaint");
      setNotificationMessage("Can't Submit Complaint");
        setNotificationColor("red");
        setShowNotification(true);
  
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
    }
  };

  const handleCancelOrder = async () => {
    try {
      
      const response = await axios.post(
        `http://127.0.0.1:8000/api/EC/cancel-order/${orderdetailsId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            // "X-CSRFToken": csrfToken, // Include the CSRF token in the request headers
          },
        }
      );
      if (response.status === 200) {
        // alert("Order canceled successfully");
        // Optionally, update the UI to reflect the canceled status
        setNotificationMessage("Order Cancelled successful!");
        setNotificationColor("green");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); 
      } else {
        setNotificationMessage("Order Cancellation failed. Please try again.");
        setNotificationColor("red");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order");
    }
  };

  return (
    <>
    {showNotification && (
      <Notification message={notificationMessage} color={notificationColor} />
    )}
    
    <div className="order-details">
       {isOrderCanceled && <span className="OrderCancelledHeader">Your order is cancelled.</span>}
      <h2>Order Details</h2>
      <p>Order ID: {orderdetailsId}</p>
      <p>Order Date: {new Date(orderInfo.orderDate).toLocaleDateString()}</p>
      <p>Status: {orderInfo.orderStatus}</p>
      {console.log(orderInfo.Status_ID)}
      <p>
        Total Amount: {"\u20B9"}
        {orderInfo.totalAmount}
      </p>
      {orderDetails.map((detail, index) => (
        <div key={index} className="order-detail-item">
          <div className="orderdetailsimgwrapper">
            <img
              src={`http://127.0.0.1:8000${detail.P_ID.Images[0].img}`}
              alt={detail.P_ID.P_Name}
              className="order-detail-product-image"
            />
          </div>
          <div className="product-info">
            <h3 className="order-detail-h3">{detail.P_ID.P_Name}</h3>
            <p className="order-detail-p">Price: {"\u20B9"}{detail.P_ID.P_Price}</p>
            <p className="order-detail-p">Quantity: {detail.ItemQuantity}</p>
            <p className="order-detail-p">
              Subtotal: {"\u20B9"}
              {detail.Subtotal}
            </p>
          </div>
        </div>
      ))}

      <form onSubmit={handleComplaintSubmit} className="ECcomplaint-form">
        <h2>Submit a Complaint</h2>
        <textarea
          value={complaintDesc}
          onChange={(e) => setComplaintDesc(e.target.value)}
          placeholder="Enter your complaint here..."
          required
        />
        <button type="submit">Submit Complaint</button>
      </form>
      {/* {!isOrderCanceled && (
        <button onClick={handleCancelOrder} className="cancel-order-button">
          Cancel Order
        </button>
      )} */}
      <div className="cancel-order-wrapper">
      {renderCancellationInfo()}
      </div>
        
    </div>
    </>
  );
};

export default ECOrderDetail;