import React from 'react';
import './Notification.css'; // Ensure you create this CSS file

const Notification = ({ message, color }) => {
 return (
    <div className={`notification ${color}`}>
      <p>{message}</p>
    </div>
 );
};

export default Notification;
