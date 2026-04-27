// server/controllers/adminController.js
const User = require('../models/User');
const MentorApplication = require('../models/MentorApplication');
const MenteeApplication = require('../models/MenteeApplication');
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

const adminController = {
    // Get all mentor applications from MentorApplication model
    getMentorApplications: async (req, res) => {
        try {
            const applications = await MentorApplication.find()
                .populate('userId', 'fullName email username profilePicture createdAt')
                .sort({ createdAt: -1 });

            // Transform to match frontend expectations
            const formattedApps = applications.map(app => ({
                _id: app._id,
                user: {
                    fullName: app.userId?.fullName || 'N/A',
                    email: app.userId?.email || 'N/A',
                    username: app.userId?.username || 'N/A'
                },
                expertise: app.expertise || 'Not specified',
                experience: app.experience || 'Not specified',
                status: app.status || 'Pending',
                createdAt: app.createdAt,
                bio: app.bio || '',
                linkedIn: app.linkedIn || '',
                hourlyRate: app.hourlyRate || '',
                certifications: app.certifications || []
            }));

            res.json(formattedApps);
        } catch (error) {
            console.error('Error in getMentorApplications:', error);
            res.status(500).json({ message: error.message, applications: [] });
        }
    },

    // Get all mentee applications from MenteeApplication model
    getMenteeApplications: async (req, res) => {
        try {
            const applications = await MenteeApplication.find()
                .populate('userId', 'fullName email username profilePicture createdAt')
                .sort({ createdAt: -1 });

            // Transform to match frontend expectations
            const formattedApps = applications.map(app => ({
                _id: app._id,
                user: {
                    fullName: app.userId?.fullName || 'N/A',
                    email: app.userId?.email || 'N/A',
                    username: app.userId?.username || 'N/A'
                },
                learningGoals: app.learningGoals || 'Not specified',
                currentSkills: app.currentSkills || 'Not specified',
                desiredSkills: app.desiredSkills || 'Not specified',
                timeCommitment: app.timeCommitment || '',
                preferredLanguage: app.preferredLanguage || '',
                background: app.background || '',
                expectations: app.expectations || '',
                status: app.status || 'Pending',
                createdAt: app.createdAt
            }));

            res.json(formattedApps);
        } catch (error) {
            console.error('Error in getMenteeApplications:', error);
            res.status(500).json({ message: error.message, applications: [] });
        }
    },

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({})
                .select('-password')
                .sort({ createdAt: -1 });

            res.json({ users: users });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({ message: error.message, users: [] });
        }
    },

    // Get analytics data
    getAnalytics: async (req, res) => {
        try {
            const totalUsers = await User.countDocuments();
            const totalMentors = await User.countDocuments({ role: 'Mentor' });
            const totalMentees = await User.countDocuments({ role: 'Mentee' });
            const pendingMentors = await MentorApplication.countDocuments({ status: 'Pending' });
            const pendingMentees = await MenteeApplication.countDocuments({ status: 'Pending' });

            res.json({
                totalUsers,
                totalMentors,
                totalMentees,
                pendingMentors,
                pendingMentees,
                activeUsers: totalUsers
            });
        } catch (error) {
            console.error('Error in getAnalytics:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get recent activities
    getRecentActivities: async (req, res) => {
        try {
            const recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('username fullName role createdAt');

            const recentMentorApps = await MentorApplication.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'fullName username');

            const recentMenteeApps = await MenteeApplication.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'fullName username');

            const activities = [];

            recentUsers.forEach(user => {
                activities.push({
                    type: 'register',
                    message: `${user.fullName || user.username} joined the platform as ${user.role}`,
                    timestamp: user.createdAt
                });
            });

            recentMentorApps.forEach(app => {
                activities.push({
                    type: 'apply',
                    message: `${app.userId?.fullName || 'Someone'} applied to become a mentor`,
                    timestamp: app.createdAt
                });
            });

            recentMenteeApps.forEach(app => {
                activities.push({
                    type: 'apply',
                    message: `${app.userId?.fullName || 'Someone'} applied to become a mentee`,
                    timestamp: app.createdAt
                });
            });

            // Sort by timestamp and get latest 10
            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            res.json(activities.slice(0, 10));
        } catch (error) {
            console.error('Error in getRecentActivities:', error);
            res.status(500).json({ message: error.message, activities: [] });
        }
    },

    // Approve mentor application
    approveMentor: async (req, res) => {
        try {
            const { applicationId } = req.params;
            const { status } = req.body;

            const application = await MentorApplication.findById(applicationId);
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            application.status = status;
            await application.save();

            if (status === 'Approved') {
                const user = await User.findById(application.userId);
                if (user) {
                    user.role = 'Mentor';
                    user.mentorStatus = 'Approved';
                    await user.save();
                }
            }

            res.json({ message: `Mentor application ${status} successfully` });
        } catch (error) {
            console.error('Error in approveMentor:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Reject mentor application
    rejectMentor: async (req, res) => {
        try {
            const { applicationId } = req.params;

            const application = await MentorApplication.findById(applicationId);
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            application.status = 'Rejected';
            await application.save();

            res.json({ message: 'Mentor application rejected successfully' });
        } catch (error) {
            console.error('Error in rejectMentor:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Approve mentee application
    approveMentee: async (req, res) => {
        try {
            const { applicationId } = req.params;
            const { status } = req.body;

            const application = await MenteeApplication.findById(applicationId);
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            application.status = status;
            await application.save();

            if (status === 'Approved') {
                const user = await User.findById(application.userId);
                if (user && user.role !== 'Mentor') {
                    user.role = 'Mentee';
                    await user.save();
                }
            }

            res.json({ message: `Mentee application ${status} successfully` });
        } catch (error) {
            console.error('Error in approveMentee:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get dashboard stats
    getDashboardStats: async (req, res) => {
        try {
            const stats = {
                userGrowth: await User.aggregate([
                    { $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }},
                    { $sort: { _id: 1 } },
                    { $limit: 6 }
                ]),
                roleDistribution: await User.aggregate([
                    { $group: {
                        _id: "$role",
                        count: { $sum: 1 }
                    }}
                ])
            };
            res.json(stats);
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get application trends
    getApplicationTrends: async (req, res) => {
        try {
            const mentorTrends = await MentorApplication.aggregate([
                { $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }},
                { $sort: { _id: 1 } },
                { $limit: 6 }
            ]);

            const menteeTrends = await MenteeApplication.aggregate([
                { $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }},
                { $sort: { _id: 1 } },
                { $limit: 6 }
            ]);

            res.json({
                applicationsTrend: mentorTrends.map((m, i) => ({
                    month: m._id,
                    mentors: m.count,
                    mentees: menteeTrends[i]?.count || 0
                })),
                monthlyGrowth: [],
                skillDistribution: [],
                experienceLevels: []
            });
        } catch (error) {
            console.error('Error in getApplicationTrends:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Update user role
    updateUserRole: async (req, res) => {
        try {
            const { userId } = req.params;
            const { role, mentorStatus } = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { role, mentorStatus },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User role updated successfully', user });
        } catch (error) {
            console.error('Error in updateUserRole:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Delete user
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            await User.findByIdAndDelete(userId);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Suspend user
    suspendUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByIdAndUpdate(
                userId,
                { isActive: false },
                { new: true }
            );
            res.json({ message: 'User suspended', user });
        } catch (error) {
            console.error('Error in suspendUser:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Activate user
    activateUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findByIdAndUpdate(
                userId,
                { isActive: true },
                { new: true }
            );
            res.json({ message: 'User activated', user });
        } catch (error) {
            console.error('Error in activateUser:', error);
            res.status(500).json({ message: error.message });
        }
    }
};
getAdvancedAnalytics: async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30*24*60*60*1000) } });
        const totalMentors = await User.countDocuments({ role: 'Mentor' });
        const totalMentees = await User.countDocuments({ role: 'Mentee' });

        // Get user growth over time
        const userGrowth = await User.aggregate([
            { $match: query },
            { $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);

        res.json({
            overview: { totalUsers, activeUsers, totalMentors, totalMentees },
            trends: userGrowth,
            // ... other analytics
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = adminController;