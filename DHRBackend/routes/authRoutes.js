import express from 'express';
import { doctorLoginUser, registerUser,otpSend,otpVerify,govLoginUser  } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/doctorLogin
router.post('/doctorLogin', doctorLoginUser);

// POST /api/auth/governmentLogin
router.post('/governmentLogin', govLoginUser );

// post /api/auth/send-otp
router.post('/send-otp', otpSend);
// post /api/auth/verify-otp
router.post('/verify-otp', otpVerify);

export default router;