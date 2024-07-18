import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {    
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = createToken(user._id);
        res.json({ success: true,  token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
        
    }

}

const createToken = (id) => {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exist = await userModel.findOne({ email });
        //check if user already exist
        if (exist) {
            return res.json({ success: false, message: "User already exist" });
        }
       // validate email format and password 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password not strong enough" });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name: name, email: email, password: hashPassword });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, data: token });
    }

    catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}

const getUserData = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        if(!userData) {
            return res.json({success: false, message: "User not found"});
        }

        res.json({ success: true, data: userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
    
}

const updateUserData = async (req, res) => {
    const { location, announcement } = req.body;
    try {
        const userData = await userModel.findById(req.body.userId);
        if(!userData) {
            return res.json({success: false, message: "User not found"});
        }
        userData.location = location;
        userData.announcement = announcement;
        //await userModel.findByIdAndUpdate(req.body.userId, userData);
        await userData.save();
        res.json({ success: true, data: userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "error" });
    }
}

export { loginUser, registerUser , getUserData,updateUserData}