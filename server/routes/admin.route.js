import express from "express";
const router = express.Router();

import { sendOTP, signUp, login } from "../controllers/auth/auth.controller.js";
import { resetPasswordToken, resetPassword } from "../controllers/auth/resetPassword.controller.js";

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// **************************************************************************************
// +-******************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

export default router;