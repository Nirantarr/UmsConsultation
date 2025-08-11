import express from 'express';

// Import all the necessary functions from our new, unified controller
import { 
    consultantSignup, 
    consultantLogin, 
    employeeSignup, 
    employeeLogin,
    verifyOtp,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// ===================================
//  User Registration Routes
// ===================================
// These routes initiate the signup process and send an OTP
router.post('/signup/consultant', consultantSignup);
router.post('/signup/employee', employeeSignup);

// ===================================
//  Email Verification Route
// ===================================
// This is the new, generic endpoint for verifying the OTP for any user type
router.post('/verify-otp', verifyOtp);

// ===================================
//  User Login Routes
// ===================================
// These routes now check if the user has been verified before logging in
router.post('/login/consultant', consultantLogin);
router.post('/login/employee', employeeLogin);

// ===================================
//  Password Reset Routes
// ===================================
// This route starts the password reset process by sending an email link
router.post('/forgot-password', forgotPassword);

// This route handles the actual password update using the token from the email
router.post('/reset-password/:token', resetPassword);


export default router;


