import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

 const navigate = useNavigate();
 let [loading, setLoading] = useState(true);

 let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
 );

 let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
 );

 let loginUser = async (e) => {
    e.preventDefault();

    
    try {
      let response = await axios.post("http://127.0.0.1:8000/api/Auth/token/", {
        mobile_no: e.target.mobile.value,
        password: e.target.password.value,
      });

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        // navigate("/"); // Uncomment this if you want to navigate after login
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
 };

 let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    // navigate("/login"); // Uncomment this if you want to navigate after logout
 };

 let updateToken = async () => {
    try {
      let response = await axios.post(
        "http://127.0.0.1:8000/api/Auth/token/refresh/",
        {
          refresh: authTokens?.refresh,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during token refresh:", error.message);
      logoutUser();
    }
 };

 useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
 }, [authTokens, loading]);

 // Removed the useEffect hook that navigates to /login based on user or loading state

 

 let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
 };

 return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
 );
};

