import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoute from './routes/userRoute.js';
import weatherRouter from './routes/weatherRoute.js';
import emailRoute from './routes/emailRoute.js';
import 'dotenv/config'
import cron from 'node-cron';
import {sendDailyEmails} from './controller/emailController.js';

//app config
const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/user", userRoute);
app.use('/api/weather', weatherRouter);
app.use('/api/email', emailRoute);

// send daily emails
cron.schedule('37 10 * * *', async () => {
    console.log('running a task every minute');
    await sendDailyEmails();
  });

//api routes
app.get("/", (req, res) => {
    res.send("server is running");
});

// db connerct 
connectDB();


//listen
app.listen(port, () => console.log(`server running on port http://localhost:${port}`))
