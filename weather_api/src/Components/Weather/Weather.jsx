import React, { useEffect, useState, useContext } from 'react';
import './Weather.css';
import WeatherCard from '../WeatherCard/WeatherCard';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets.js';

const Weather = () => {
    const { city, url, setCity } = useContext(StoreContext);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [viewMore, setViewMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialDaysToShow = 4;

    const searchWeather = async () => {
        try {
            setLoading(true);
            console.log(`${url}/api/weather/weather?query=${city}`);
            const response = await axios.get(`${url}/api/weather/weather?query=${city}`);
            console.log(response.data);
            setWeatherData(response.data.weatherData);
            setWeatherForecast(response.data.weatherData.weatherForecast.forecastday);

            const dateTime = response.data.weatherData.currentWeather.location.localtime.split(' ');
            setDate(dateTime[0]);
            setTime(dateTime[1]);
        } catch (error) {
            console.log(error);
            toast.error('City not found');
            setCity('Ho Chi Minh');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchWeather();
    }, [city]);

    return (
        <div className={`weather ${loading ? 'loading' : ''}`}>
            {loading && <div className="spinner">Loading...</div>}
            {weatherData ? (
                <div className='weather-info'>
                    <div className="weather-info-right">
                        <div>
                            <h1>{weatherData.currentWeather.location.name} ({date})</h1>
                            <h2 className="last-updated">Last Updated {time}</h2>
                        </div>
                       
                        <div className="weather-info-item">
                            <img src={assets.wind} alt="" />
                            <h2>Temperature: {weatherData.currentWeather.current.temp_c}°C</h2>
                        </div>
                        <div className="weather-info-item">
                            <img src={assets.wind} alt="" />
                            <h2>Wind: {weatherData.currentWeather.current.wind_kph}km/h</h2>
                        </div>
                        <div className="weather-info-item">
                            <img src={assets.humidity} alt="" />
                            <h2>Humidity: {weatherData.currentWeather.current.humidity}%</h2>
                        </div>
                    </div>
                    <div className="weather-info-left">
                        <img src={weatherData.currentWeather.current.condition.icon} alt="" />
                        <h2>{weatherData.currentWeather.current.condition.text}</h2>
                    </div>
                </div>
            ) : (
                <div className='weather-info'>
                    <div className="weather-info-right">
                        <h1>London(2024-07-19)</h1>
                        <div className="weather-info-item">
                            <img src={assets.cloud} alt="" />
                            <h2>Temperature: 15°C</h2>
                        </div>
                        <div className="weather-info-item">
                            <img src={assets.wind} alt="" />
                            <h2>Wind: 5km/h</h2>
                        </div>
                        <div className="weather-info-item">
                            <img src={assets.humidity} alt="" />
                            <h2>Humidity: 60%</h2>
                        </div>
                    </div>
                    <div className="weather-info-left">
                        <img src={assets.cloud} alt="" />
                        <h2>Cloudy</h2>
                    </div>
                </div>
            )}
            <div className="weather-card-container">
                <h1>Weather Card</h1>
                <div>
                    {weatherData ? (
                        <div className={`weather-card-item ${viewMore ? 'view-more' : ''}`}>
                            {weatherForecast.slice(0, viewMore ? weatherForecast.length : initialDaysToShow).map((item, index) => (
                                <WeatherCard weatherData={item} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="weather-card-item">
                            <WeatherCard />
                            <WeatherCard />
                            <WeatherCard />
                            <WeatherCard />
                        </div>
                    )}
                </div>
                {weatherData && weatherForecast.length > initialDaysToShow && (
                    <button className="view-more-button" onClick={() => setViewMore(!viewMore)}>
                        {viewMore ? 'Show Less' : 'View More'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Weather;
