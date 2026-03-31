const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authenticate');
const adminController = require('../controllers/adminController');

// Protect routes with authenticate and isAdmin
router.get('/dashboard', authenticate, isAdmin, adminController.getDashboardData);
router.post('/post', authenticate, isAdmin, adminController.createPost);
router.put('/post/:id', authenticate, isAdmin, adminController.updatePost);
router.delete('/post/:id', authenticate, isAdmin, adminController.deletePost);

module.exports = router;
