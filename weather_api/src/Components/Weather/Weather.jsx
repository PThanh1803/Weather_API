import React, { useEffect } from 'react'
import './Weather.css'
import WeatherCard from '../WeatherCard/WeatherCard'
import { useContext ,useState} from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Weather = () => {
    const {city,url,setCity,setCurrentCity,currentCity} = useContext(StoreContext)
    const [weatherData, setWeatherData] = useState(null);
    const [weatherError, setWeatherError] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [currCity, setCurrCity] = useState('');
    const searchWeather = async () => {
        try {
            console.log(`${url}/api/weather/weather?query=${city}`)
            const response = await axios.get(`${url}/api/weather/weather?query=${city}`);
            console.log(response.data)
            setWeatherData(response.data.weatherData);
            setCurrCity(response.data.weatherData.currentWeather.location.name);
             setWeatherError(null);
             setWeatherForecast(response.data.weatherData.weatherForecast.forecastday);
        } catch (error) {
            console.log(error);
            toast.error('City not found');
            setWeatherError('City not found.');
            setCity('Ho Chi Minh');
        }
    };

  

    useEffect(() => {
        searchWeather();
        if(weatherError===null){
            setCurrentCity(currCity)
        }
    }, [city]);

  return (
    <div className="weather">
        {weatherData?
            <div className='weather-info'>
                <div className="weather-info-right">
                    <h1>{weatherData.currentWeather.location.name} ({weatherData.currentWeather.current.last_updated}) </h1>
                    <div className="weather-info-item">
                        <img src="/src/assets/wind.png" alt="" />
                        <h2>Temperature: {weatherData.currentWeather.current.temp_c}°C</h2>
                    </div>
                    <div className="weather-info-item">
                        <img src="/src/assets/wind.png" alt="" />
                        <h2>Wind: {weatherData.currentWeather.current.wind_kph}km/h</h2>
                    </div>

                    <div className="weather-info-item">
                        <img src="/src/assets/humidity.png" alt="" />
                        <h2>Humidity: {weatherData.currentWeather.current.humidity}%</h2>
                    </div>

                </div>

                <div className="weather-info-left">
                    <img src={weatherData.currentWeather.current.condition.icon} alt="" />
                    <h2>{weatherData.currentWeather.current.condition.text}</h2>
                </div>
                
            </div>:
            <div className='weather-info'>
            <div className="weather-info-right">
                <h1>London(2023-06-19) </h1>
                <div className="weather-info-item">
                    <img src="/src/assets/wind.png" alt="" />
                    <h2>Temperature: 15°C</h2>
                </div>
                <div className="weather-info-item">
                    <img src="/src/assets/wind.png" alt="" />
                    <h2>Wind: 5km/h</h2>
                </div>

                <div className="weather-info-item">
                    <img src="/src/assets/humidity.png" alt="" />
                    <h2>Humidity: 60%</h2>
                </div>

            </div>

            <div className="weather-info-left">
                <img src="/src/assets/cloud.png" alt="" />
                <h2>Cloudy</h2>
            </div>
            
        </div>
        
        }
        

        <div className="weather-card-container">
            <h1>Weather Card</h1>
            <div>
                {weatherData ? 
                (<div className="weather-card-item">
                    {weatherForecast.slice(1).map((item, index) => (
                        <WeatherCard weatherData={item} key={index} />
                    ))}
                 </div>)
        
                 : (
                    <div  className="weather-card-item">
                        <WeatherCard />
                        <WeatherCard />
                        <WeatherCard />
                        <WeatherCard />
                    </div>
                )}
            </div>
        </div>

    </div>
  )
}

export default Weather