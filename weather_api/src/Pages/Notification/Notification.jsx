import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Notification.css';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const Notification = () => {
    const { url, updateUserData, userData,setLocation } = useContext(StoreContext);
    const [city, setCity] = useState(userData.location);
    const [weather, setWeather] = useState(null);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(userData.announcement);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearchWeather = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${url}/api/weather/weather?query=${city}`);
            if (response.data.success) {
                setWeather(response.data.weatherData);
                setMessage(null);
                setSearchPerformed(true);
                toast.success('Location found');
            } else {
                setMessage("City not found or other error occurred");
                setWeather(null);
                setSearchPerformed(false);
                toast.error('Location not found');
            }
        } catch (error) {
            console.log(error);
            setMessage('City not found or other error occurred');
            setWeather(null);
            setSearchPerformed(false);
            toast.error('Location not found');
        }
    };

    const handleSubscribe = () => {
        setIsSubscribed(true);
        toast.success('Subscribed to weather notifications');
    };

    const handleUnsubscribe = () => {
        setIsSubscribed(false);
        toast.success('Unsubscribed from weather notifications');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSearchPerformed(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCity(userData.location);
        setSearchPerformed(false);
    };

    const handleSave = async () => {
        if (message) {
            toast.error('Location not found');
            return;
        }
        setIsEditing(false);
        await updateUserData(isSubscribed, city);
        setLocation(city);
        toast.success('Announcement updated');
    };

    return (
        <div className="notification">
            <div className="notification-header">
                <h2>Subscribe to Weather Notifications</h2>
                {!isEditing&&<h3 onClick={handleEditToggle}  style={{ cursor: 'pointer' }}> Edit</h3>}
                {isEditing && <h3 onClick={searchPerformed||isEditing? handleSave:()=> {toast.error('Click to search first');
            return;}} style={{ cursor: 'pointer' }} >Save</h3>}
                {isEditing && <h3 onClick={handleCancel} style={{ cursor: 'pointer' }}>Cancel</h3>}
            </div>

            <form onSubmit={handleSearchWeather}>
                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={!isEditing}
                    />
                </div>
                <button type="submit" disabled={!isEditing}>Search Weather</button>
            </form>
            <div>
                <button onClick={handleSubscribe} disabled={!isEditing || isSubscribed}>Subscribe</button>
                <button onClick={handleUnsubscribe} disabled={!isEditing || !isSubscribed}>Unsubscribe</button>
            </div>
            {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '30px' }}>{message}</p>}
            {weather && (
                <div>
                    <h2>{weather.currentWeather.location.name}</h2>
                    <h2>Current Weather</h2>
                    <div className='weather-info-item'>
                        <div>
                            <p>Temperature: {weather.currentWeather.current.temp_c}°C</p>
                            <p>Wind Speed: {weather.currentWeather.current.wind_kph} kph</p>
                            <p>Humidity: {weather.currentWeather.current.humidity}%</p>
                        </div>
                        <div>
                            <img src={weather.currentWeather.current.condition.icon} alt="" />
                            <p>{weather.currentWeather.current.condition.text}</p>
                        </div>
                    </div>
                    <h2>Forecast</h2>
                    <div className='weather-forecast'>
                        {weather.weatherForecast.forecastday.slice(1).map((day) => (
                            <div key={day.date} className='weather-forecast-item'>
                                <p>Date: {day.date}</p>
                                <p>Max Temp: {day.day.maxtemp_c}°C</p>
                                <p>Min Temp: {day.day.mintemp_c}°C</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
