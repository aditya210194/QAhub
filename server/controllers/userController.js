const User = require('../models/User');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            total: users.length,
            mentors: users.filter(u => u.role === 'Mentor').length,
            mentees: users.filter(u => u.role === 'Mentee').length,
            admins: users.filter(u => u.role === 'Admin').length,
            active: users.filter(u => u.isActive !== false).length,
            inactive: users.filter(u => u.isActive === false).length
        };

        res.json({ users, stats });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Manage user actions (suspend, activate, edit role)
const manageUser = async (req, res) => {
    try {
        const { userId, action } = req.params;

        let updateData = {};

        switch(action) {
            case 'suspend':
                updateData = { isActive: false };
                break;
            case 'activate':
                updateData = { isActive: true };
                break;
            case 'edit-role':
                const { role } = req.body;
                if (!['User', 'Mentee', 'Mentor', 'Admin'].includes(role)) {
                    return res.status(400).json({ error: 'Invalid role' });
                }
                updateData = { role };
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log activity
        await logActivity({
            userId: req.user.id,
            action: `User ${action}`,
            target: userId,
            details: updateData
        });

        res.json({ message: `User ${action}ed successfully`, user });
    } catch (error) {
        console.error('Error in manageUser:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user.id;

        // Remove sensitive fields
        delete updates.password;
        delete updates.role;

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Helper function to log activities
const logActivity = async (activity) => {
    try {
        const Activity = require('../models/Activity');
        await Activity.create(activity);
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = {
    getAllUsers,
    manageUser,
    getUserById,
    updateProfile
};