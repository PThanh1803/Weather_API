import fetch from 'node-fetch';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
dotenv.config(); // Load environment variables from .env file

const generateRandomPassword= (length) =>{
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
const getWeather = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
  const response = await fetch(url);
  const data = await response.json();
  if (response.status === 200) {
    return {
      location: { name: city },
      current: {
        condition: { text: data.current.condition.text, icon: data.current.condition.icon },
        temp_c: data.current.temp_c,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
      },
    };
  } else {
    throw new Error('Failed to retrieve weather data');
  }
};

const sendEmail = async (subject, textBody, htmlBody, toEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject,
    text: textBody,
    html: htmlBody,
  };
  console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD, process.env.WEATHER_API_KEY);

  await transporter.sendMail(mailOptions);
};


const generateEmailContent = (weather) => {
    const iconUrl = `http:${weather.current.condition.icon}`; // Adjust protocol as needed
  
    return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style=" background-color: rgb(45, 117, 212); padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #555;"> DAILY WEATHER REPORT </h2>
          <h1 style="font-size: 24px;text-transform: uppercase; color: #555; text-align: center;margin: 10px;">${weather.location.name}</h1>
          <div style="margin: 20px 0;">
            <img src="${iconUrl}" alt="${weather.current.condition.text}" style="vertical-align: middle; margin-right: 10px;">
            <span style="font-size: 18px; color: #555;"><strong>${weather.current.condition.text}</strong></span>
          </div>
          <p style="font-size: 16px; color: #333;">Temperature: <strong>${weather.current.temp_c}°C</strong></p>
          <p style="font-size: 16px; color: #333;">Humidity: <strong>${weather.current.humidity}%</strong></p>
          <p style="font-size: 16px; color: #333;">Wind: <strong>${weather.current.wind_kph} km/h</strong></p>
        </div>
        <footer style="margin-top: 20px; text-align: center; color: #777;">
          <p>Thank you for subscribing to our weather updates!</p>
          <p><em>PhamThanh1803</em></p>
        </footer>
      </div>
    `;
  };
  

const generateSubscriptionContent = (message) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; ">
      <div style="background-color: rgb(45, 117, 212); padding: 20px; border-radius: 10px; text-align: center;">
        <h3 style="color: #555;">${message}</h3>
      </div>
      <footer style="margin-top: 20px; text-align: center; color: #777;">
        <p>Thank you for subscribing to our weather updates!</p>
        <p><em>PhamThanh1803</em></p>
      </footer>
    </div>
  `;
};

const sendSubscriptionEmail = async (req, res) => {
  const subscriber = await userModel.findById(req.body.userId);
  if (!subscriber) {
    return res.json({ success: false, message: 'User not found' });
  }
  const email = subscriber.email;
  const city = subscriber.location;
  try {
    const subject = `Weather Update Subscription Status`;
    let textBody = '';
    let htmlBody = '';
    if (subscriber.announcement) {
      textBody = "You have subscribed to weather updates. Please check your email for daily weather updates. You will receive notification about weather forecast EVERYDAY AT 7:10 AM";
      htmlBody = generateSubscriptionContent("You have subscribed to weather updates. Please check your email for daily weather updates.");
    } else {
      textBody = "You have unsubscribed from weather updates. You will no longer receive daily weather updates. ";
      htmlBody = generateSubscriptionContent("You have unsubscribed from weather updates. You will no longer receive daily weather updates.");
    }
    await sendEmail(subject, textBody, htmlBody, email);
    console.log(`Email sent to ${email}`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    res.json({ success: false, message: 'Failed to send email' });
  }
};

const sendPassword = async (req, res) => {
  const subject = 'Your Password Forgot ';
  const email = req.body.email;
    try {
        
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const password = generateRandomPassword(8);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await userModel.findByIdAndUpdate(user._id, { password: hashPassword });
        const textBody = `Your new password is : ${password}`;
        const htmlBody = generateSubscriptionContent(`Your new password is: ${password}`);
        try {
            await sendEmail(subject, textBody, htmlBody, email);
            console.log(`Email sent to ${email}`);
            res.json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
            res.json({ success: false, message: 'Failed to send email' });      
            }
    } catch (error) {
        console.error(`Failed to send email to`, error);
        res.json({ success: false, message: 'Failed to send email' });
    }
}
      
   
  
const sendDailyEmails = async (req, res) => {
  try {
    const subscribers = await userModel.find({});
    if (!subscribers || subscribers.length === 0) {
      return res.json({ success: false, message: 'No subscribers found' });
    }

    for (const subscriber of subscribers) {
      if (!subscriber.announcement) {
        continue;
      }

      const email = subscriber.email;
      const city = subscriber.location;
      try {
        const weather = await getWeather(city);
        const subject = `Daily Weather Update for ${city}`;
        const textBody = `Weather in ${city}: ${weather.current.condition.text}, Temperature: ${weather.current.temp_c}°C`;
        const img = weather.current.condition.icon;
        console.log(img);
        const htmlBody = generateEmailContent(weather);
        await sendEmail(subject, textBody, htmlBody, email);
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }

    res.json({ success: true, message: 'Daily emails sent successfully' });
  } catch (error) {
    console.error('Error sending daily emails:', error);
    res.json({ success: false, message: 'Failed to send daily emails' });
  }
};

export { sendSubscriptionEmail, sendDailyEmails, sendPassword };
