const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users (Admin Only)
router.get('/admin/users', authenticate, authorize('Admin'), userController.getAllUsers);

// Manage user actions (Admin Only)
router.post('/admin/users/:userId/:action', authenticate, authorize('Admin'), userController.manageUser);

// Get user by ID
router.get('/:userId', authenticate, userController.getUserById);

// Update user profile
router.put('/profile', authenticate, userController.updateProfile);

module.exports = router;