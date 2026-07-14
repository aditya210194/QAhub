// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==================== MULTER CONFIGURATION FOR FILE UPLOADS ====================
// Configure storage for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile_pictures';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: profile-{userId}-{timestamp}-{random}.{ext}
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-${req.user.id}-${uniqueSuffix}${ext}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// Multer upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
}).single('profilePicture');

// ==================== GET CURRENT USER PROFILE ====================
// GET /api/profile - Get current user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        console.log('📡 Profile request for user ID:', req.user.id);

        const user = await User.findById(req.user.id)
            .select('-password -resetPasswordCode -resetPasswordExpires');

        if (!user) {
            console.log('❌ User not found for ID:', req.user.id);
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        console.log('✅ Profile found for user:', user.username);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== UPDATE USER PROFILE ====================
// PUT /api/profile - Update user profile (with optional image upload)
router.put('/profile', authenticate, (req, res) => {
    upload(req, res, async (err) => {
        // Handle multer errors
        if (err) {
            console.error('❌ Upload error:', err);
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        try {
            console.log('📡 Profile update request for user:', req.user.id);
            console.log('📦 Update data:', req.body);

            const { username, fullName, email, bio, location, experienceLevel, skills } = req.body;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Update fields
            if (username) user.username = username;
            if (fullName) user.fullName = fullName;
            if (email) user.email = email;
            if (bio !== undefined) user.bio = bio;
            if (location !== undefined) user.location = location;
            if (experienceLevel) user.experienceLevel = experienceLevel;

            // Handle skills - convert from comma-separated string to array
            if (skills !== undefined) {
                if (typeof skills === 'string') {
                    user.skills = skills.split(',').map(s => s.trim()).filter(s => s);
                } else if (Array.isArray(skills)) {
                    user.skills = skills;
                }
            }

            // Handle profile picture upload
            if (req.file) {
                // Delete old profile picture if exists
                if (user.profilePicture) {
                    try {
                        const oldPath = path.join(__dirname, '..', user.profilePicture);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                            console.log('🗑️ Deleted old profile picture:', oldPath);
                        }
                    } catch (unlinkErr) {
                        console.warn('⚠️ Could not delete old profile picture:', unlinkErr.message);
                    }
                }

                // Set new profile picture path
                user.profilePicture = `uploads/profile_pictures/${req.file.filename}`;
                console.log('🖼️ Profile picture updated:', user.profilePicture);
            }

            await user.save();

            // Return updated user without sensitive fields
            const updatedUser = user.toObject();
            delete updatedUser.password;
            delete updatedUser.resetPasswordCode;
            delete updatedUser.resetPasswordExpires;

            console.log('✅ Profile updated for user:', user.username);
            res.json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
});

// ==================== GET PROFILE BY USERNAME ====================
// GET /api/profile/:username - Get user profile by username
router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        console.log('📡 Profile request for username:', username);

        const user = await User.findOne({ username })
            .select('-password -resetPasswordCode -resetPasswordExpires -email');

        if (!user) {
            console.log('❌ User not found for username:', username);
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        console.log('✅ Profile found for user:', user.username);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== GET PROFILE BY USER ID ====================
// GET /api/profile/id/:userId - Get user profile by ID (Admin only)
router.get('/profile/id/:userId', authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('📡 Profile request for user ID:', userId);

        // Check if requesting user is admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin only.'
            });
        }

        const user = await User.findById(userId)
            .select('-password -resetPasswordCode -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== UPLOAD PROFILE PICTURE ONLY ====================
// POST /api/profile/upload-picture - Upload profile picture only
router.post('/profile/upload-picture', authenticate, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('❌ Upload error:', err);
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Delete old profile picture if exists
            if (user.profilePicture) {
                try {
                    const oldPath = path.join(__dirname, '..', user.profilePicture);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                } catch (unlinkErr) {
                    console.warn('⚠️ Could not delete old profile picture:', unlinkErr.message);
                }
            }

            // Set new profile picture path
            user.profilePicture = `uploads/profile_pictures/${req.file.filename}`;
            await user.save();

            console.log('🖼️ Profile picture uploaded for user:', user.username);
            res.json({
                success: true,
                message: 'Profile picture uploaded successfully',
                data: {
                    profilePicture: user.profilePicture
                }
            });
        } catch (error) {
            console.error('❌ Error uploading profile picture:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
});

// ==================== DELETE PROFILE PICTURE ====================
// DELETE /api/profile/delete-picture - Delete profile picture
router.delete('/profile/delete-picture', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (user.profilePicture) {
            try {
                const filePath = path.join(__dirname, '..', user.profilePicture);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('🗑️ Deleted profile picture:', filePath);
                }
            } catch (unlinkErr) {
                console.warn('⚠️ Could not delete profile picture:', unlinkErr.message);
            }

            user.profilePicture = '';
            await user.save();
        }

        res.json({
            success: true,
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting profile picture:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;