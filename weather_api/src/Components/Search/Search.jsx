import React, { useEffect } from 'react'
import './Search.css'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Search = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { token, userData, url, setCity, city, currentCity } = useContext(StoreContext)
  const [loca, setLoca] = React.useState('')

  const onchange = (e) => {
    setLoca(e.target.value);
  }

  const handleOnClick = () => {
    setCity(loca)
    console.log(city)
  }

  const handleOnClickCurr = () => {
    setCity(currentCity)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOnClick();
    }
  }

  return (
    <div className="search">
      <div className="search-container">
        <h1>Enter a city name</h1>
        <input 
          onChange={onchange} 
          onKeyPress={handleKeyPress} 
          type="text" 
          placeholder='E.g, New York, London, Tokyo' 
        />
        <button onClick={handleOnClick}>Search</button>
        <hr />
        <button onClick={handleOnClickCurr}>Use Current Location</button>
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

export default Search
