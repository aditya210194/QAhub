const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/authenticate'); // A middleware to authenticate the JWT token
const router = express.Router();

// Set up multer storage for profile picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures'); // Directory for profile picture storage
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename with timestamp
    }
});

const upload = multer({ storage: storage });

// Middleware to authenticate the user based on JWT token
router.use(authenticate); // Ensure the user is authenticated

// GET: Fetch user's profile data
router.get('/profile',authenticate, async (req, res) => {
    try {
        console.log("Authenticated user ID:", req.user?.id);  // ✅ Log user ID
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
// Ensure profilePicture is a full URL
        const profilePictureUrl = user.profilePicture
            ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profilePicture.replace(/\\/g, '/')}`
            : null;
        console.log("Fetched user:", user);  // ✅ Log user data
        res.status(200).json({
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            bio: user.bio,
            location: user.location,
            experienceLevel: user.experienceLevel,  // Added here
            skills: user.skills,  // Added her
            profilePicture: profilePictureUrl,
        });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT: Update user's profile data and upload a profile picture
router.put('/profile', upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, fullName, email, bio, location, experienceLevel, skills, links } = req.body;
        const profilePicture = req.file ? req.file.path : null; // Handle optional profile picture upload

        const user = await User.findById(req.user.id); // Find the user by their ID from JWT token

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile details
        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.location = location || user.location;
        user.experienceLevel = experienceLevel || user.experienceLevel;
        user.skills = Array.isArray(skills) ? skills : skills.split(',').map((skill) => skill.trim()); // Convert skills to an array
        user.links = links || user.links; // Handle links if provided

        if (profilePicture) {
            user.profilePicture = profilePicture; // Store the path to the uploaded image
        }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                bio: user.bio,
                location: user.location,
                experienceLevel: user.experienceLevel,
                skills: user.skills,
                profilePicture: user.profilePicture,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;