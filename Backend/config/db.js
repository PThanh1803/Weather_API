import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://phamthanh:18032003@cluster0.api86kx.mongodb.net/weather_api').then(() => {
        console.log("Database connected");
    })
}