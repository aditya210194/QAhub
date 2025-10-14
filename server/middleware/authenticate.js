const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookieParser = require('cookie-parser'); // Ensure it's used in server.js
require('dotenv').config();

const authenticate = async (req, res, next) => {
    let token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        token = req.cookies?.token; // Check cookies if header is missing
    }

    if (!token) {
        console.warn('Access Denied: No token provided.');
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error('JWT Error:', error);
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

// 🔹 Middleware to Check Admin Role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access Denied. Admins Only.' });
    }
};

module.exports = { authenticate, isAdmin };
