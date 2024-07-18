import express from 'express'; 
import { fetchWeather } from '../controller/weatherController.js';

const weatherRouter = express.Router();

weatherRouter.get('/weather', fetchWeather);

export default weatherRouter 