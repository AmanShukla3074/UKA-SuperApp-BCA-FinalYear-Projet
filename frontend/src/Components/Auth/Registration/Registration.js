import React, { useState } from "react";
import "./Registration.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import Notification from '../../Notification/Notification'
const Registration = ({ onNext }) => {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationColor, setNotificationColor] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);

  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);

  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);

  const [isMobileNumberEmpty, setIsMobileNumberEmpty] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isDobValid, setIsDobValid] = useState(true);
  const [isGenderValid, setIsGenderValid] = useState(true);

  const [otp, setOtp] = useState(["", "", "", ""]); 
  const [showOtpInput, setShowOtpInput] = useState(false); 
  const [serverOtp, setServerOtp] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "mobileNumber") setMobileNumber(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "dob") setDob(value);
    else if (name === "gender") setGender(value);
  };

  const handleOtpChange = (index, value) => {
    otp[index] = value;
    setOtp([...otp]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      mobile_no: mobileNumber,
      password: password,
      email: email,
      dob: dob,
      Gender: gender,
      Role: {
        Role_Name: "Customer",
      },
      Status: {
        Status_Name: "Online",
      },
    };
    console.log("Sending OTP request with body:", requestBody);
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/send-otp/",
        { mobile_no: mobileNumber }
      );
      if (response.status === 200) {
        setServerOtp(response.data.otp.toString()); 
        console.log("Received OTP:", response.data.otp);
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
      await registerUser();
    } else {
      alert("Invalid OTP. Please try again.");
      navigate("/")
    }
  };

  const registerUser = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/register/",
        {
          first_name: firstName,
          last_name: lastName,
          mobile_no: mobileNumber,
          password: password,
          email: email,
          dob: dob,
          Gender: gender,
          Role: {
            Role_Name: "Customer",
          },
          Status: {
            Status_Name: "Online",
          },
        } 
      );
      if (response.status === 200) {
        navigate("/address", { state: { userId: response.data.user_id } });
        alert(response.data.user_id)
      } else {
        alert("err",response.data.user_id)
        setNotificationMessage("Registration failed. Please try again.");
        setNotificationColor("red");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
   } catch (error) {
      setNotificationMessage("An error occurred during registration.");
      setNotificationColor("red");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const validateFirstName = () => {
    const isEmpty = firstName === "";
    setIsFirstNameEmpty(isEmpty);

    const isValidFormat = /^[a-zA-Z]+$/.test(firstName);
    setIsFirstNameValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateLastName = () => {
    const isEmpty = lastName === "";
    setIsLastNameEmpty(isEmpty);

    const isValidFormat = /^[a-zA-Z]+$/.test(lastName);
    setIsLastNameValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateMobileNumber = () => {
    const isEmpty = mobileNumber === "";
    setIsMobileNumberEmpty(isEmpty);

    const isValidFormat = /^\d{10}$/.test(mobileNumber);
    setIsMobileNumberValid(isValidFormat);

    return !isEmpty && isValidFormat;
  };

  const validateEmail = () => {
    const isValid = email === "" || /\S+@\S+\.\S+/.test(email);
    setIsEmailValid(isValid);
    return isValid;
  };

  const validatePassword = () => {
    const isValid = password !== "" && password.length >= 6;
    setIsPasswordValid(isValid);
    return isValid;
  };

  const validateDob = () => {
    const isValid = dob !== "";
    setIsDobValid(isValid);
    return isValid;
  };

  const validateGender = () => {
    const isValid = gender !== "";
    setIsGenderValid(isValid);
    return isValid;
  };

  const handleNext = () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isMobileValid = validateMobileNumber();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isMobileValid &&
      isEmailValid &&
      isPasswordValid &&
      isDobValid &&
      isGenderValid
    ) {
      console.log({
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
        dob,
        gender,
        profilePicture,
      });

       onNext && onNext();

      navigate("/otp");
    } else {
      console.log("Form has errors. Please check your inputs.");
    }
  };

  return (
    <>
     {showNotification && (
      <Notification message={notificationMessage} color={notificationColor} />
    )}
    
    <div className="registration-container">
      <h2>Registration</h2>
      {!showOtpInput ? (
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={validateFirstName}
              className={!isFirstNameValid ? "invalid" : ""}
            />
            {!isFirstNameValid && !isFirstNameEmpty && (
              <span className="error">Invalid first name</span>
            )}
            {!isFirstNameValid && isFirstNameEmpty && (
              <span className="error">First name cannot be empty</span>
            )}
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={validateLastName}
              className={!isLastNameValid ? "invalid" : ""}
            />
            {!isLastNameValid && !isLastNameEmpty && (
              <span className="error">Invalid last name</span>
            )}
            {!isLastNameValid && isLastNameEmpty && (
              <span className="error">Last name cannot be empty</span>
            )}
          </label>
          <label>
            Mobile Number:
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onBlur={validateMobileNumber}
              className={!isMobileNumberValid ? "invalid" : ""}
            />
            {!isMobileNumberValid && !isMobileNumberEmpty && (
              <span className="error">Invalid mobile number</span>
            )}
            {!isMobileNumberValid && isMobileNumberEmpty && (
              <span className="error">Mobile number cannot be empty</span>
            )}
          </label>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              className={!isEmailValid ? "invalid" : ""}
            />
            {!isEmailValid && <span className="error">Invalid email</span>}
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              className={!isPasswordValid ? "invalid" : ""}
            />
            {!isPasswordValid && (
              <span className="error">
                Password must be at least 6 characters
              </span>
            )}
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().split("T")[0]}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={!isDobValid ? "invalid" : ""}
            />
            {!isDobValid && (
              <span className="error">Date of Birth is required</span>
            )}
          </label>
          <label>
            Gender:
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={!isGenderValid ? "invalid" : ""}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {!isGenderValid && (
              <span className="error">Gender is required</span>
            )}
          </label>
          {/* Profile Picture */}
          {/* <label>
            Profile Picture:
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </label> */}

          <button type="submit">Next</button>
          <label className="account">
            <span>
              <Link to="/login" className="custom-link">
                Have an account? Login
              </Link>
            </span>
          </label>
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
    </>
  );
};

export default Registration;
