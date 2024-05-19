import React, { useState, useContext } from "react";
import axios from "axios";
import "./ChangePassword.css";
import AuthContext from "../../../Context/AuthContext"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ChangePassword = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // OTP input state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
  const [mobileNo, setMobileNo] = useState(""); // Mobile number for OTP
  const [serverOtp, setServerOtp] = useState(""); // OTP received from the server

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else if (name === "mobileNo") setMobileNo(value);
  };

  const handleOtpChange = (index, value) => {
    otp[index] = value;
    setOtp([...otp]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword || !mobileNo) {
      setError("All fields are required");
      return;
    }

    if (newPassword === oldPassword) {
      setError("New password must be different from the old password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match");
      return;
    }

    // Send OTP to the user's mobile number
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/send-otp/",
        { mobile_no: mobileNo }
      );
      if (response.status === 200) {
        setServerOtp(response.data.otp.toString()); // Store the received OTP
        console.log("Received OTP:", response.data.otp); // Log the received OTP
        setShowOtpInput(true);
      } else {
        alert("An error occurred while sending the OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      alert("An error occurred while sending the OTP.");
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue === serverOtp) {
      // OTP verified, proceed with password change
      await changePassword();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/change_password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Your password has been changed successfully!");
        console.log("Password changed successfully");
        navigate("/"); // Navigate to home page on success
      } else {
        console.error("Error changing password:", response.data);
        alert("An error occurred while changing the password.");
        navigate("/changepassword"); // Navigate to change password page on failure
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      alert("An error occurred while changing the password.");
      navigate("/changepassword"); // Navigate to change password page on failure
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>

      {!showOtpInput ? (
        <form onSubmit={handleSubmit}>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNo"
            value={mobileNo}
            onChange={handleChange}
          />

          <label>Old Password:</label>
          <input
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={handleChange}
          />

          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
          />

          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button type="submit">Submit</button>
        </form>
      ) : (
        <div className="OTPcontainer">
          <div className="OTPitems">
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[0]}
            onChange={(e) => handleOtpChange(0, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[1]}
            onChange={(e) => handleOtpChange(1, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[2]}
            onChange={(e) => handleOtpChange(2, e.target.value)}
          />
          <input
            className="OTPItem"
            type="text"
            maxLength="1"
            value={otp[3]}
            onChange={(e) => handleOtpChange(3, e.target.value)}
          />
</div>
        <button className="OTPbtn" onClick={handleOtpSubmit}>
        Submit OTP
      </button>

        </div>
      )}
      
    </div>
  );
};

export default ChangePassword;

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import './ChangePassword.css';
// import AuthContext from '../../../Context/AuthContext'; // Adjust the import path as necessary
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const ForgotPassword = () => {
//  const { authTokens } = useContext(AuthContext);
//  const navigate = useNavigate(); // Initialize useNavigate
//  const [newPassword, setNewPassword] = useState('');
//  const [confirmPassword, setConfirmPassword] = useState('');
//  const [otp, setOtp] = useState(['', '', '', '']); // OTP input state
//  const [error, setError] = useState('');
//  const [successMessage, setSuccessMessage] = useState('');
//  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
//  const [mobileNo, setMobileNo] = useState(''); // Mobile number for OTP
//  const [serverOtp, setServerOtp] = useState(''); // OTP received from the server

//  const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'newPassword') setNewPassword(value);
//     else if (name === 'confirmPassword') setConfirmPassword(value);
//     else if (name === 'mobileNo') setMobileNo(value);
//  };

//  const handleOtpChange = (index, value) => {
//     otp[index] = value;
//     setOtp([...otp]);
//  };

//  const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!newPassword || !confirmPassword || !mobileNo) {
//       setError('All fields are required');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('New password and confirm password must match');
//       return;
//     }

//     // Send OTP to the user's mobile number
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/Auth/send-otp/', { mobile_no: mobileNo });
//       if (response.status === 200) {
//         setServerOtp(response.data.otp.toString()); // Store the received OTP
//         console.log("Received OTP:", response.data.otp); // Log the received OTP
//         setShowOtpInput(true);
//       } else {
//         alert('An error occurred while sending the OTP.');
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error.message);
//       alert('An error occurred while sending the OTP.');
//     }
//  };

//  const handleOtpSubmit = async () => {
//     const otpValue = otp.join('');
//     if (otpValue === serverOtp) {
//       // OTP verified, proceed with password change
//       await changePassword();
//     } else {
//       alert('Invalid OTP. Please try again.');
//     }
//  };

//  const changePassword = async () => {
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/Auth/forget_password/', {
//         mobileno: mobileNo, // Adjusted property name
//         new_password: newPassword, // Adjusted property name
//         confirm_password: confirmPassword // Adjusted property name
//       }, {
//         headers: {
//           Authorization: `Bearer ${authTokens?.access}`
//         }
//       });

//       if (response.status === 200) {
//         setSuccessMessage('Your password has been changed successfully!');
//         console.log('Password changed successfully');
//         navigate('/'); // Navigate to home page on success
//       } else {
//         console.error('Error changing password:', response.data);
//         alert('An error occurred while changing the password.');
//         navigate('/forgotpassword'); // Navigate to forgot password page on failure
//       }
//     } catch (error) {
//       console.error('Error changing password:', error.message);
//       alert('An error occurred while changing the password.');
//       navigate('/forgotpassword'); // Navigate to forgot password page on failure
//     }
// };

//  return (
//     <div className="change-password-container">
//       <h2>Forgot Password</h2>
//       {!showOtpInput ? (
//         <form onSubmit={handleSubmit}>
//           <label>Mobile Number:</label>
//           <input
//             type="text"
//             name="mobileNo"
//             value={mobileNo}
//             onChange={handleChange}
//           />

//           <label>New Password:</label>
//           <input
//             type="password"
//             name="newPassword"
//             value={newPassword}
//             onChange={handleChange}
//           />

//           <label>Confirm Password:</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={confirmPassword}
//             onChange={handleChange}
//           />

//           {error && <p className="error-message">{error}</p>}
//           {successMessage && <p className="success-message">{successMessage}</p>}

//           <button type="submit">Submit</button>
//         </form>
//       ) : (
//         <div>
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[0]}
//             onChange={(e) => handleOtpChange(0, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[1]}
//             onChange={(e) => handleOtpChange(1, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[2]}
//             onChange={(e) => handleOtpChange(2, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[3]}
//             onChange={(e) => handleOtpChange(3, e.target.value)}
//           />
//           <button onClick={handleOtpSubmit}>Submit OTP</button>
//         </div>
//       )}
//     </div>
//  );
// };

// export default ForgotPassword;

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import './ChangePassword.css';
// import AuthContext from '../../../Context/AuthContext';// Adjust the import path as necessary

// const ChangePassword = () => {
//  const { authTokens } = useContext(AuthContext);
//  const [oldPassword, setOldPassword] = useState('');
//  const [newPassword, setNewPassword] = useState('');
//  const [confirmPassword, setConfirmPassword] = useState('');
//  const [otp, setOtp] = useState(['', '', '', '']); // OTP input state
//  const [error, setError] = useState('');
//  const [successMessage, setSuccessMessage] = useState('');
//  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
//  const [mobileNo, setMobileNo] = useState(''); // Mobile number for OTP
//  const [serverOtp, setServerOtp] = useState(''); // OTP received from the server

//  const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'oldPassword') setOldPassword(value);
//     else if (name === 'newPassword') setNewPassword(value);
//     else if (name === 'confirmPassword') setConfirmPassword(value);
//     else if (name === 'mobileNo') setMobileNo(value);
//  };

//  const handleOtpChange = (index, value) => {
//     otp[index] = value;
//     setOtp([...otp]);
//  };

//  const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!oldPassword || !newPassword || !confirmPassword || !mobileNo) {
//       setError('All fields are required');
//       return;
//     }

//     if (newPassword === oldPassword) {
//       setError('New password must be different from the old password');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('New password and confirm password must match');
//       return;
//     }

//     // Send OTP to the user's mobile number
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/Auth/send-otp/', { mobile_no: mobileNo });
//       if (response.status === 200) {
//         setServerOtp(response.data.otp.toString()); // Store the received OTP
//         console.log("Received OTP:", response.data.otp); // Log the received OTP
//         setShowOtpInput(true);
//       } else {
//         alert('An error occurred while sending the OTP.');
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error.message);
//       alert('An error occurred while sending the OTP.');
//     }
//  };

//  const handleOtpSubmit = async () => {
//     const otpValue = otp.join('');
//     if (otpValue === serverOtp) {
//       // OTP verified, proceed with password change
//       await changePassword();
//     } else {
//       alert('Invalid OTP. Please try again.');
//     }
//  };

//  const changePassword = async () => {
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/Auth/change_password/', {
//         old_password: oldPassword,
//         new_password: newPassword,
//         confirm_password: confirmPassword
//       }, {
//         headers: {
//           Authorization: `Bearer ${authTokens?.access}`
//         }
//       });

//       if (response.status === 200) {
//         setSuccessMessage('Your password has been changed successfully!');
//         setOldPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setOtp(['', '', '', '']);
//         setError('');
//       } else {
//         alert('An error occurred while changing the password.');
//       }
//     } catch (error) {
//       console.error('Error changing password:', error.message);
//       alert('An error occurred while changing the password.');
//     }
//  };

//  return (
//     <div className="change-password-container">
//       <h2>Change Password</h2>
//       {!showOtpInput ? (
//         <form onSubmit={handleSubmit}>
//           <label>Mobile Number:</label>
//           <input
//             type="text"
//             name="mobileNo"
//             value={mobileNo}
//             onChange={handleChange}
//           />

//           <label>Old Password:</label>
//           <input
//             type="password"
//             name="oldPassword"
//             value={oldPassword}
//             onChange={handleChange}
//           />

//           <label>New Password:</label>
//           <input
//             type="password"
//             name="newPassword"
//             value={newPassword}
//             onChange={handleChange}
//           />

//           <label>Confirm Password:</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={confirmPassword}
//             onChange={handleChange}
//           />

//           {error && <p className="error-message">{error}</p>}
//           {successMessage && <p className="success-message">{successMessage}</p>}

//           <button type="submit">Change Password</button>
//         </form>
//       ) : (
//         <div>
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[0]}
//             onChange={(e) => handleOtpChange(0, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[1]}
//             onChange={(e) => handleOtpChange(1, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[2]}
//             onChange={(e) => handleOtpChange(2, e.target.value)}
//           />
//           <input
//             type="text"
//             maxLength="1"
//             value={otp[3]}
//             onChange={(e) => handleOtpChange(3, e.target.value)}
//           />
//           <button onClick={handleOtpSubmit}>Submit OTP</button>
//         </div>
//       )}
//     </div>
//  );
// };

// export default ChangePassword;

// import React, { useState } from 'react';
// import './ChangePassword.css';

// const ChangePassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'oldPassword') setOldPassword(value);
//     else if (name === 'newPassword') setNewPassword(value);
//     else if (name === 'confirmPassword') setConfirmPassword(value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validation
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     if (newPassword === oldPassword) {
//       setError('New password must be different from the old password');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('New password and confirm password must match');
//       return;
//     }

//     // TODO: Add logic to change the password

//     // Reset form and error, show success message
//     setOldPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setError('');
//     setSuccessMessage('Your password has been changed successfully!');
//   };

//   return (
//     <div className="change-password-container">
//       <h2>Change Password</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Old Password:</label>
//         <input
//           type="password"
//           name="oldPassword"
//           value={oldPassword}
//           onChange={handleChange}
//         />

//         <label>New Password:</label>
//         <input
//           type="password"
//           name="newPassword"
//           value={newPassword}
//           onChange={handleChange}
//         />

//         <label>Confirm Password:</label>
//         <input
//           type="password"
//           name="confirmPassword"
//           value={confirmPassword}
//           onChange={handleChange}
//         />

//         {error && <p className="error-message">{error}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}

//         <button type="submit">Change Password</button>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;
