import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../../Context/AuthContext'; // Adjust the import path as necessary
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './OrdersList.css';

const OrdersList = () => {
 const { authTokens } = useContext(AuthContext);
 const [orders, setOrders] = useState([]);

 // Define the formatDate function
 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
 };
 useEffect(() => {
  const fetchOrders = async () => {
     try {
       const response = await axios.get('http://127.0.0.1:8000/api/EC/order/', {
         headers: {
           Authorization: `Bearer ${authTokens?.access}`,
         },
       });
 
       if (response.status === 200) {
         // Sort the orders by OrderDate in descending order
         const sortedOrders = response.data.sort((a, b) => {
           return new Date(b.OrderDate) - new Date(a.OrderDate);
         });
 
         setOrders(sortedOrders);
       } else {
         throw new Error('Failed to fetch orders');
       }
     } catch (error) {
       console.error('Error fetching orders:', error);
     }
  };
 
  fetchOrders();
 }, [authTokens]);
 

//  useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/EC/order/', {
//           headers: {
//             Authorization: `Bearer ${authTokens?.access}`,
//           },
//         });

//         if (response.status === 200) {
//           setOrders(response.data);
//         } else {
//           throw new Error('Failed to fetch orders');
//         }
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();
//  }, [authTokens]);

 return (
    <div className='orderlist-wrapper'>
      {orders.map(order => (
        <Link className="orderLink" to={`/ecommerce/orderdetails/${order.OrderID}` }>
        <div key={order.OrderID} className="order-container">
          <h2>Order ID: {order.OrderID}</h2>
          <p>Order Date: {formatDate(order.OrderDate)}</p> {/* Use the formatDate function here */}
          <p>Status Name: {order.Status_ID.Status_Name}</p>
          <p>Total Amount:  {"\u20B9"}{order.Total}</p>
        </div>
          </Link>
      ))}
    </div>
 );
};

export default OrdersList;