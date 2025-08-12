import Consultant from '../models/Consultant.js';
import Employee from '../models/Employee.js';
import Counter from '../models/Counter.js';
import Otp from '../models/Otp.js'; // <-- IMPORT THE NEW OTP MODEL
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // <-- IMPORT NODEMAILER
import otpGenerator from 'otp-generator'; // <-- IMPORT OTP-GENERATOR
import { randomBytes } from 'crypto'; // <-- IMPORT CRYPTO FOR RESET TOKEN
dotenv.config();
// ===============================
// SETUP
// ===============================

// Helper: JWT Token Generation (No changes needed)
const generateToken = (id, type, isAdmin = false) => {
  return jwt.sign(
    { id, type, isAdmin }, // Payload contains necessary info
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Nodemailer Transporter: For sending emails
// Make sure to set EMAIL_USER and EMAIL_PASS in your .env file
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ===============================
// SIGNUP & VERIFICATION
// ===============================

// Generic function to handle OTP generation and email sending
const sendVerificationOtp = async (email) => {
    // Generate a 6-digit numerical OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    
    // Clear any old OTPs for this email to prevent issues
    await Otp.deleteMany({ email });
    
    // Save the new OTP to our separate collection
    await new Otp({ email, otp }).save();

    // Send the email
    await transporter.sendMail({
        from: `UniConsult <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Your UniConsult Verification Code',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <style>
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            @media (prefers-color-scheme: dark) {
                .body-bg { background-color: #121212 !important; }
                .content-card { background-color: #1e1e1e !important; }
                .heading, .paragraph { color: #e0e0e0 !important; }
                .footer-text { color: #777777 !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #f0f2f5;" class="body-bg">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" class="content-card">
                        <!-- Gradient Header -->
                        <tr>
                            <td align="center" style="padding: 20px; background-image: linear-gradient(to right, #4f46e5, #a855f7);">
                                <h1 style="font-size: 32px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -1px;">
                                    UniConsult
                                </h1>
                            </td>
                        </tr>
                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 5px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <h2 style="font-size: 24px; font-weight: 600; color: #282828; margin: 0 0 15px 0;" class="heading">Your Secure Code</h2>
                                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 30px 0;" class="paragraph">Please use this one-time password to complete your sign-up process.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 0px 0;">
                                            <!-- The OTP -->
                                            <div style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #4338ca; background-color: #eef2ff; padding: 20px 40px; border-radius: 8px; display: inline-block;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <p style="font-size: 14px; color: #888888; margin: 30px 0 0 0;" class="paragraph">This code is valid for 10 minutes.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                             <td align="center" style="padding: 30px 20px 30px 20px; border-top: 1px solid #e5e7eb;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 0;" class="footer-text">
                                    &copy; ${new Date().getFullYear()} UniConsult. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `,
    });
};

// MODIFIED: Consultant Signup
export const consultantSignup = async (req, res) => {
  try {
    const { email, phone, organizationName, organizationType, password } = req.body;

    let consultant = await Consultant.findOne({ email });
    
    // Scenario 1: A verified user already exists
    if (consultant && consultant.isVerified) {
        return res.status(400).json({ message: "A verified account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Scenario 2: User exists but isn't verified. Update their info and resend OTP.
    if (consultant && !consultant.isVerified) {
        consultant.password = hashedPassword;
        consultant.phone = phone;
        consultant.organizationName = organizationName;
        consultant.organizationType = organizationType;
        await consultant.save();
    } else {
    // Scenario 3: New user. Create them.
        consultant = new Consultant({
            email, phone, organizationName, organizationType,
            password: hashedPassword,
            isVerified: false // Explicitly set to false
        });
        await consultant.save();
    }

    // Send the OTP email
    await sendVerificationOtp(email);

    // Respond without a token. User must verify first.
    res.status(201).json({ message: "Registration successful! Please check your email for a verification OTP." });

  } catch (err) {
    console.error("CONSULTANT SIGNUP ERROR:", err);
    res.status(500).json({ error: "An error occurred during registration." });
  }
};

// MODIFIED: Employee Signup
export const employeeSignup = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        let employee = await Employee.findOne({ email });

        if (employee && employee.isVerified) {
            return res.status(400).json({ message: "A verified account with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (employee && !employee.isVerified) {
            employee.password = hashedPassword;
            employee.fullName = fullName;
            employee.phone = phone;
            await employee.save();
        } else {
            const counter = await Counter.findOneAndUpdate(
                { id: 'employeeId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }
            );

            employee = new Employee({
                fullName, email, phone,
                password: hashedPassword,
                employeeId: counter.seq,
                isVerified: false
            });
            await employee.save();
        }

        await sendVerificationOtp(email);

        res.status(201).json({ message: "Registration successful! Please check your email for a verification OTP." });

    } catch (err) {
        console.error("EMPLOYEE SIGNUP ERROR:", err);
        res.status(500).json({ error: "An error occurred during registration." });
    }
};

// NEW: Verify OTP Function
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        // 1. Find the OTP in our Otp collection. TTL index handles expiration.
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please try signing up again." });
        }

        // 2. Find the user in EITHER Consultant or Employee collections
        let user = await Consultant.findOne({ email }) || await Employee.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found. Please complete the signup process." });
        }

        // 3. Update user to be verified
        user.isVerified = true;
        await user.save();

        // 4. Delete the used OTP
        await Otp.deleteOne({ _id: validOtp._id });

        res.status(200).json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        console.error("OTP VERIFY ERROR:", error);
        res.status(500).json({ message: "Server error during OTP verification." });
    }
};

// ===============================
// LOGIN
// ===============================

// MODIFIED: Consultant Login
export const consultantLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const consultant = await Consultant.findOne({ email });
    if (!consultant) return res.status(404).json({ message: "Invalid credentials" });
    
    // IMPORTANT: Check if user is verified before allowing login
    if (!consultant.isVerified) {
        // Option to resend OTP here if desired
        await sendVerificationOtp(email);
        return res.status(403).json({ message: "Account not verified. A new OTP has been sent to your email." });
    }

    const isMatch = await bcrypt.compare(password, consultant.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(consultant._id, 'consultant');
    res.status(200).json({
      token,
      user: {
        _id: consultant._id,
        name: consultant.organizationName,
        type: "consultant"
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MODIFIED: Employee Login
export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Invalid credentials" });
    
    // IMPORTANT: Check if user is verified
    if (!employee.isVerified) {
        await sendVerificationOtp(email);
        return res.status(403).json({ message: "Account not verified. A new OTP has been sent to your email." });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(employee._id, 'employee', employee.is_admin);
    res.status(200).json({
      token,
      user: {
        _id: employee._id,
        name: employee.fullName,
        type: "employee",
        isAdmin: employee.is_admin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// PASSWORD RESET
// ===============================

// NEW: Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Find user in either collection
        const user = await Consultant.findOne({ email }) || await Employee.findOne({ email });

        // Security: Always send a success response to prevent email enumeration
        if (!user || !user.isVerified) {
            return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
        }

        const resetToken = randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // NOTE: Adjust the frontend URL as needed
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
           from: `UniConsult <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'UniConsult Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        });

        res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// NEW: Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = token; // In a real app, you might hash this token too. For simplicity, we'll use it directly.

        // Find user by the token in either collection
        const user = await Consultant.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }) || await Employee.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "Server error." });
    }
};


