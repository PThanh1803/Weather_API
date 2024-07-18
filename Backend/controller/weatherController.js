

import { getWeather } from '../services/weatherService.js';


const fetchWeather = async (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.json({success: false, message: 'Missing query parameter'});
    }
    try {
      const weatherData = await getWeather(query);
      res.json({success: true, weatherData});
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      res.json({success: false, message: 'Failed to fetch weather data'});
    }
  };
  
export { fetchWeather }