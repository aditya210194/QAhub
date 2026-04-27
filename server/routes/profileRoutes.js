// routes/profileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/profile_pictures';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        // Sanitize the filename
        const sanitizedName = `profile-${req.user.id}-${uniqueSuffix}${ext}`;
        cb(null, sanitizedName);
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
router.get('/test-file/:filename', authenticate, async (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/profile_pictures', filename);

    try {
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            res.json({
                exists: true,
                path: filepath,
                size: stats.size,
                created: stats.birthtime
            });
        } else {
            // List all files in directory
            const files = fs.readdirSync(path.join(__dirname, '../uploads/profile_pictures'));
            res.json({
                exists: false,
                requestedFile: filename,
                availableFiles: files
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch user's profile data
router.get('/profile', authenticate, async (req, res) => {
    try {
        console.log("Fetching profile for user ID:", req.user.id);

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct the full URL for profile picture
        let profilePictureUrl = null;
        if (user.profilePicture) {
            // Get just the filename if it's a full path
            let filename = user.profilePicture;
            if (filename.includes('/')) {
                filename = filename.split('/').pop();
            }
            if (filename.includes('\\')) {
                filename = filename.split('\\').pop();
            }

            // Construct the full URL
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            profilePictureUrl = `${baseUrl}/uploads/profile_pictures/${filename}`;

            console.log("Generated profile picture URL:", profilePictureUrl);
        }

        res.status(200).json({
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            bio: user.bio || '',
            location: user.location || '',
            experienceLevel: user.experienceLevel || '',
            skills: user.skills || [],
            profilePicture: profilePictureUrl,
        });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT: Update user's profile data and upload a profile picture
router.put('/profile', authenticate, upload.single('profilePicture'), async (req, res) => {
    try {
        console.log("Updating profile for user ID:", req.user.id);
        console.log("Request body:", req.body);
        console.log("File:", req.file);

        const { username, fullName, email, bio, location, experienceLevel, skills } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile details
        if (username) user.username = username;
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (experienceLevel) user.experienceLevel = experienceLevel;

        // Handle skills
        if (skills) {
            if (Array.isArray(skills)) {
                user.skills = skills;
            } else if (typeof skills === 'string') {
                user.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
            }
        }

        // Handle profile picture upload
        if (req.file) {
            console.log("File uploaded successfully:", req.file.filename);
            // Store just the filename
            user.profilePicture = req.file.filename;

            // Optional: Delete old profile picture if it exists
            if (user.profilePicture && user.profilePicture !== req.file.filename) {
                const oldFilePath = path.join(__dirname, '../uploads/profile_pictures', user.profilePicture);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log("Deleted old profile picture:", oldFilePath);
                }
            }
        }

        await user.save();
        console.log("User profile updated successfully");

        // Construct the URL for the response
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const profilePictureUrl = user.profilePicture
            ? `${baseUrl}/uploads/profile_pictures/${user.profilePicture}`
            : null;

        res.status(200).json({
            message: 'Profile updated successfully',
            profilePicture: user.profilePicture,
            user: {
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                bio: user.bio,
                location: user.location,
                experienceLevel: user.experienceLevel,
                skills: user.skills,
                profilePicture: profilePictureUrl,
            }
        });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;