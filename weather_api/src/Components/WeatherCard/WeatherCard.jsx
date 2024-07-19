import React from 'react'
import './WeatherCard.css'
import {assets} from '../../assets/assets.js'

const WeatherCard = ({weatherData}) => {
  return (
    <div className="weather-card-container">
      {weatherData?
        <div className="weather-card">
            <h2 className="weather-card-title">({weatherData.date})</h2>
            <img src={weatherData.day.condition.icon} alt="" />
            <h2>{weatherData.day.condition.text}</h2>
            <h2>Temp: {weatherData.day.avgtemp_c}°C</h2>
            <h2>Wind: {weatherData.day.maxwind_kph}km/h</h2>
        </div>
      :<div className="weather-card">
          <h2 className="weather-card-title">(2024-07-19)</h2>
          <img src={assets.cloud} alt="" />
          <h2>Temp: 15°C</h2>
          <h2>Wind: 5km/h</h2>
          <h2>Humidity: 60%</h2>
      </div>
    }
        
    </div>
    
  )
}

export default WeatherCard