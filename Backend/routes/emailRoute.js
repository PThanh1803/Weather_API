import express from 'express';
import { sendSubscriptionEmail, sendDailyEmails ,sendPassword} from '../controller/emailController.js';
import authMiddleware from '../middleware/auth.js';

const emailRouter = express.Router();

emailRouter.post('/senddaily', sendDailyEmails);
emailRouter.post('/subscribe',authMiddleware, sendSubscriptionEmail);
emailRouter.post('/password', sendPassword);

export default emailRouter