// server/routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate, authorize('Admin'));

// Approve mentor application
router.put('/approve-mentor/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const MentorApplication = require('../models/MentorApplication');
        const User = require('../models/User');

        const application = await MentorApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || 'Approved';
        await application.save();

        if (application.status === 'Approved') {
            const user = await User.findById(application.userId);
            if (user) {
                user.role = 'Mentor';
                user.mentorStatus = 'Approved';
                await user.save();
            }
        }

        res.json({ message: `Mentor application ${application.status} successfully` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Reject mentor application
router.put('/reject-mentor/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const MentorApplication = require('../models/MentorApplication');

        const application = await MentorApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = 'Rejected';
        await application.save();

        res.json({ message: 'Mentor application rejected successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Approve mentee application
router.put('/approve-mentee/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const MenteeApplication = require('../models/MenteeApplication');
        const User = require('../models/User');

        const application = await MenteeApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || 'Approved';
        await application.save();

        if (application.status === 'Approved') {
            const user = await User.findById(application.userId);
            if (user && user.role !== 'Mentor') {
                user.role = 'Mentee';
                await user.save();
            }
        }

        res.json({ message: `Mentee application ${application.status} successfully` });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Reject mentee application
router.put('/reject-mentee/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const MenteeApplication = require('../models/MenteeApplication');

        const application = await MenteeApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = 'Rejected';
        await application.save();

        res.json({ message: 'Mentee application rejected successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Dashboard & Analytics
router.get('/analytics', adminController.getAnalytics);
router.get('/recent-activities', adminController.getRecentActivities);
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/application-trends', adminController.getApplicationTrends);

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);
router.post('/users/:userId/suspend', adminController.suspendUser);
router.post('/users/:userId/activate', adminController.activateUser);

// Mentor/Mentee Applications - Use correct endpoints
router.get('/mentor-applications', adminController.getMentorApplications);
router.get('/mentee-applications', adminController.getMenteeApplications);
router.put('/approve-mentor/:applicationId', adminController.approveMentor);
router.put('/reject-mentor/:applicationId', adminController.rejectMentor);
router.put('/approve-mentee/:applicationId', adminController.approveMentee);

router.get('/test-data', async (req, res) => {
    const mentorApps = await MentorApplication.find().populate('userId', 'fullName email');
    const menteeApps = await MenteeApplication.find().populate('userId', 'fullName email');
    res.json({
        mentorApplications: mentorApps.length,
        menteeApplications: menteeApps.length,
        mentors: mentorApps,
        mentees: menteeApps
    });
});

module.exports = router;