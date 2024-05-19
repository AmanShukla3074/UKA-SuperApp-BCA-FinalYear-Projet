import React, { useContext, useState } from "react";
import "./OTP.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";
const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber; // Access the mobile number from the state

  let { logoutUser } = useContext(AuthContext);
  
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      // alert(otp)
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/verify_otp/",
        {
          otp: otp,
          mobile_no: mobileNumber, // Include the mobile number in the request
        }
      );
        let data=response.data
        console.log(data.status);
      if (response.data.status === 200) {
        const token = response.data.token; // Adjust this based on the actual response structure
        // localStorage.setItem("authTokens", JSON.stringify(token));
        navigate("/"); // Navigate to the next page after successful OTP verification
        // alert("Token Stored");
      } else {
        // alert("OTP verification failed. Please try again.");
        // console.log("Calling logoutUser");
        const f1 = logoutUser;
        f1(); // This calls the logoutUser functio
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      // alert("An error occurred while verifying OTP.");
      // f1 = () =>{logoutUser}
      // f1()
      const f1 = logoutUser;
      f1(); // This calls the logoutUser function
      navigate("/");
    }
  };

  return (
    <div className="OTP">
      <h2>OTP Verification</h2>
      <form>
        {/* <div className="otpWrapper"> */}
        <div className="otpDigit">
          {[1, 2, 3, 4].map((digit) => (
            <input
              key={digit}
              type="text"
              maxLength="1"
              value={otp[digit - 1]}
              onChange={(e) => {
                const newOtp = otp.split("");
                newOtp[digit - 1] = e.target.value;
                setOtp(newOtp.join(""));
              }}
            />
          ))}
        </div>

        <button type="button" onClick={handleVerify}>
          Verify
        </button>

        {/* <button type="button">
        {/* <button type="button" onClick={() => navigate("/address")}> 
        Next
        </button> */}
      </form>
    </div>
  );
};

export default OTP;
