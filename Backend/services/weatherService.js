import axios from 'axios';


const apiKey = "fba1afd7090143f8ab3115807241607" ; // Replace with your WeatherAPI key
const baseUrl = 'http://api.weatherapi.com/v1';

const getWeather = async (city) => {
  try {
    const currentWeatherResponse = await axios.get(`${baseUrl}/current.json`, {
      params: {
        key: apiKey,
        q: city
      }
    });

    const weatherForecastResponse = await axios.get(`${baseUrl}/forecast.json`, {
      params: {
        key: apiKey,
        q: city,
        days: 5
      }
    });

    return {
      currentWeather: currentWeatherResponse.data,
      weatherForecast: weatherForecastResponse.data.forecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};


export { getWeather }