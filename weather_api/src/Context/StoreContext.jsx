import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://weather-api-backend.onrender.com";
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({});
  const [city, setCity] = useState('Ho Chi Minh');
  const [currentCity, setCurrentCity] = useState('Ho Chi Minh');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/user/profile`, {}, { headers: { token } });
      setUserData(response.data.data);
      setCity(response.data.data.location);
      setLoading(false);
    } catch (error) {
      console.log("Error profile", error);
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${url}/api/email/subscribe`, {}, { headers: { token } });
    } catch (error) {
      console.log("Error profile", error);
    }
  };

  const updateUserData = async (announcement, location) => {
    try {
      const userAnnouncement = userData.announcement;
      await axios.post(`${url}/api/user/update`, { location, announcement }, { headers: { token } });
      if (announcement !== userAnnouncement) {
        sendEmail();
      }
    } catch (error) {
      console.log("Error profile", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await fetchUserData(localStorage.getItem("token"));
      } else {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCity() {
      if (localStorage.getItem("token")) {
        try {
          await fetchUserData(localStorage.getItem("token"));
        } catch (error) {
          console.error('Error fetching city:', error);
        }
      }
    }
    fetchCity();
  }, [location]);

  const contextValue = {
    url,
    token,
    setToken,
    userData,
    city,
    setCity,
    currentCity,
    setCurrentCity,
    updateUserData,
    setLocation,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {!loading && props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
