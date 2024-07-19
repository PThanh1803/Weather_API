import React, { useEffect, useState } from 'react';
import './Search.css';
import { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Search = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { token, setCity, currentCity,history, setHistory } = useContext(StoreContext);
  const [loca, setLoca] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const handleFocus = () => {
    setShowPopup(true);
  }

  const handleBlur = () => {
    setTimeout(() => setShowPopup(false), 100); // Delay to allow click event to register
  }

  const onchange = (e) => {
    setLoca(e.target.value);
  }

  const handleOnClick = () => {
    if (loca.trim() !== '') {
      setCity(loca);
      const updatedHistory = [loca, ...history.filter(item => item !== loca)];
      setHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setShowPopup(false);
    }
  }

  const handleOnClickCurr = () => {
    setCity(currentCity);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOnClick();
    }
  }

  const handleHistoryClick = (city) => {
    setLoca(city);
    setCity(city);
    setShowPopup(false);
  }

  return (
    <div className="search">
      <div className="search-container">
        <h1>Enter a city name</h1>
        <div className="search-popup" onFocus={handleFocus} onBlur={handleBlur}>
          <input 
            onChange={onchange} 
            onKeyPress={handleKeyPress} 
            type="text" 
            placeholder='E.g, New York, London, Tokyo'
            value={loca}
          />
          {showPopup && history.length > 0 && (
            <div className="search-popup-content">
              <h3>Recent Searches</h3>
              <ul>
                {history.map((item, index) => (
                  <li key={index} onClick={() => handleHistoryClick(item)}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button onClick={handleOnClick} >Search </button>
        <hr />
        <button onClick={handleOnClickCurr}>Use Current Location </button>
      </div>
      <div>
        {token ? (
          <div className="banner">
            <h1>WEATHER DASHBOARD</h1>
            <p>Turn on notifications now to receive the latest weather updates
              via email! Don't miss the chance to stay informed with the fastest and most accurate
              weather information. With just a few simple steps, you'll be notified whenever there are weather changes in your area.</p>
            <button onClick={() => navigate("/notify")}>TURN ON NOTIFICATIONS</button>
          </div>
        ) : (
          <div className="banner">
            <h1>WEATHER DASHBOARD</h1>
            <p>Sign up now to receive the latest weather updates
              via email! Don't miss the chance to stay informed with the fastest and most accurate
              weather information. With just a few simple steps, you'll be notified whenever there are weather changes in your area.
            </p>
            <button onClick={() => setShowLogin(true)}>SIGN UP NOW</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;
