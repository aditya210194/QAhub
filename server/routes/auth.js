const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const registerValidator = require('../validators/registerValidator');
const router = express.Router();
const nodemailer = require('nodemailer');
const { authenticate, isAdmin } = require('../middleware/authenticate');
const crypto = require('crypto'); // Add this at the top of your file


// 🚀 ✅ Public Route - Register
router.post('/register', async (req, res) => {
    const { error } = registerValidator.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const userExists = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// 🚀 ✅ Public Route - Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict'
        });

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, username: user.username, fullName: user.fullName }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🚀 ✅ Public Route - Forgot Password (Step 1)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Invalid email format" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found with this email" });

    // Generate a random reset code
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character code
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // ✅ Send email with reset code
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Your reset code is: <strong>${resetCode}</strong>. Use this code to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Password reset code sent to your email' });
    });
});

// 🚀 ✅ Public Route - Reset Password (Step 2)
router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Email, reset code, and new password are required, and password must be at least 6 characters long' });
    }

    try {
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }, // Check if the code is still valid
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired reset code' });

        // Update the password and clear the reset code
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error("Reset Password Error:", err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🚀 ✅ Protected Routes (Requires Authentication)
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🚀 ✅ Protected Route Example
router.get('/protected-route', authenticate, (req, res) => {
    res.json({ message: "You have accessed a protected route!" });
});

module.exports = router;
