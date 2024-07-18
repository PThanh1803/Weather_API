import express from 'express';
import { loginUser, registerUser,getUserData,updateUserData, resetPassword } from '../controller/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/profile',authMiddleware,getUserData );
userRouter.post('/update',authMiddleware,updateUserData );
userRouter.post('/password',resetPassword);
export default userRouter