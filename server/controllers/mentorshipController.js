// controllers/mentorshipController.js
const User = require('../models/User');
const MentorApplication = require('../models/MentorApplication');
const MenteeApplication = require('../models/MenteeApplication'); // Create this model
const Mentor = require("../models/Mentor");
const Mentee = require("../models/Mentee"); // Create this model
const MentorshipRequest = require('../models/MentorshipRequest');
const nodemailer = require('nodemailer');

let io;

const setSocketIO = (socketInstance) => {
    io = socketInstance;
};

// ✅ Apply to become a mentor
const applyMentor = async (req, res) => {
    try {
        const { expertise, experience, availability, bio, linkedIn, hourlyRate, certifications } = req.body;

        // Check if user already has a pending or approved application
        const existingApplication = await MentorApplication.findOne({
            userId: req.user.id,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingApplication) {
            return res.status(409).json({
                message: 'You already have a pending or approved mentor application'
            });
        }

        // Create new mentor application
        const newApplication = new MentorApplication({
            userId: req.user.id,
            expertise,
            experience,
            availability,
            bio,
            linkedIn,
            hourlyRate,
            certifications,
            status: 'Pending'
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Mentor application submitted successfully',
            application: newApplication
        });
    } catch (error) {
        console.error('Error in applyMentor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Get mentor application status
const getMentorApplicationStatus = async (req, res) => {
    try {
        const application = await MentorApplication.findOne({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        if (!application) {
            return res.json({ status: null, message: 'No mentor application found' });
        }

        res.json({
            status: application.status.toLowerCase(),
            appliedAt: application.createdAt,
            updatedAt: application.updatedAt
        });
    } catch (error) {
        console.error('Error in getMentorApplicationStatus:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Apply to become a mentee
const applyMentee = async (req, res) => {
    try {
        const { learningGoals, currentSkills, desiredSkills, timeCommitment, preferredLanguage, background, expectations } = req.body;

        // Check if user already has a pending or approved mentee application
        const existingApplication = await MenteeApplication.findOne({
            userId: req.user.id,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingApplication) {
            return res.status(409).json({
                message: 'You already have a pending or approved mentee application'
            });
        }

        // Create new mentee application
        const newApplication = new MenteeApplication({
            userId: req.user.id,
            learningGoals,
            currentSkills,
            desiredSkills,
            timeCommitment,
            preferredLanguage,
            background,
            expectations,
            status: 'Pending'
        });

        await newApplication.save();

        res.status(201).json({
            message: 'Mentee application submitted successfully',
            application: newApplication
        });
    } catch (error) {
        console.error('Error in applyMentee:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Get mentee application status
const getMenteeApplicationStatus = async (req, res) => {
    try {
        const application = await MenteeApplication.findOne({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        if (!application) {
            return res.json({ status: null, message: 'No mentee application found' });
        }

        res.json({
            status: application.status.toLowerCase(),
            appliedAt: application.createdAt,
            updatedAt: application.updatedAt
        });
    } catch (error) {
        console.error('Error in getMenteeApplicationStatus:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject Mentor Application (Admin Only)
const approveMentor = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await MentorApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update application status
        application.status = status;
        await application.save();

        if (status === 'Approved') {
            const user = await User.findById(application.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user role to Mentor
            user.role = 'Mentor';
            user.mentorStatus = 'Approved';
            await user.save();

            // Create Mentor profile
            const newMentor = new Mentor({
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                linkedIn: application.linkedIn,
                expertise: application.expertise,
                experience: application.experience,
                availability: application.availability,
                bio: application.bio,
                hourlyRate: application.hourlyRate,
                certifications: application.certifications
            });
            await newMentor.save();

            // Send email notification
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Mentor Application Approved',
                html: `
                    <h2>Congratulations!</h2>
                    <p>Your application to become a mentor has been approved.</p>
                    <p>You can now start accepting mentorship requests from students.</p>
                    <a href="${process.env.FRONTEND_URL}/mentorship">Visit Mentorship Page</a>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({ message: `Mentor application ${status} successfully` });
    } catch (error) {
        console.error('Error in approveMentor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject Mentee Application (Admin Only)
const approveMentee = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await MenteeApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update application status
        application.status = status;
        await application.save();

        if (status === 'Approved') {
            const user = await User.findById(application.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user role to Mentee if not already Mentor
            if (user.role !== 'Mentor') {
                user.role = 'Mentee';
            }
            user.menteeStatus = 'Approved';
            await user.save();

            // Create Mentee profile
            const newMentee = new Mentee({
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                learningGoals: application.learningGoals,
                currentSkills: application.currentSkills,
                desiredSkills: application.desiredSkills,
                timeCommitment: application.timeCommitment,
                preferredLanguage: application.preferredLanguage,
                background: application.background,
                expectations: application.expectations
            });
            await newMentee.save();

            // Send email notification
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Mentee Application Approved',
                html: `
                    <h2>Welcome to the Mentorship Program!</h2>
                    <p>Your application to become a mentee has been approved.</p>
                    <p>You can now browse and connect with mentors to start your learning journey!</p>
                    <a href="${process.env.FRONTEND_URL}/mentorship">Browse Mentors</a>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({ message: `Mentee application ${status} successfully` });
    } catch (error) {
        console.error('Error in approveMentee:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ List all approved mentors
const listMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().populate('userId', 'username fullName email profilePicture');
        res.json(mentors);
    } catch (error) {
        console.error('Error in listMentors:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Request mentorship from a mentor
const requestMentorship = async (req, res) => {
    try {
        const { mentorId, message } = req.body;
        const menteeId = req.user.id;

        // Check if mentee has approved mentee application
        const menteeApplication = await MenteeApplication.findOne({
            userId: menteeId,
            status: 'Approved'
        });

        if (!menteeApplication) {
            return res.status(403).json({
                error: 'You must have an approved mentee application to request mentorship'
            });
        }

        // Check if mentee exists
        const mentee = await User.findById(menteeId);
        if (!mentee) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if mentor exists and is approved
        const mentor = await User.findOne({ _id: mentorId, role: 'Mentor', mentorStatus: 'Approved' });
        if (!mentor) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            mentorId,
            menteeId,
            status: { $in: ['Pending', 'Approved'] }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'You already have a pending or approved request with this mentor' });
        }

        // Create mentorship request
        const newRequest = new MentorshipRequest({
            mentorId,
            menteeId,
            message: message || '',
            status: 'Pending'
        });

        await newRequest.save();

        res.status(201).json({
            message: 'Mentorship request submitted successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error in requestMentorship:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Get mentorship requests for a specific mentor
const getRequests = async (req, res) => {
    try {
        const { mentorId } = req.params;

        const requests = await MentorshipRequest.find({ mentorId })
            .populate('menteeId', 'username fullName email profilePicture')
            .sort('-createdAt');

        res.json(requests);
    } catch (error) {
        console.error('Error in getRequests:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// ✅ Approve or Reject mentorship request
const approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'Approved' or 'Rejected'

        const request = await MentorshipRequest.findById(requestId)
            .populate('menteeId', 'email fullName')
            .populate('mentorId', 'email fullName');

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Update request status
        request.status = status;
        await request.save();

        // Send email notification to mentee
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const emailStatus = status === 'Approved' ? 'approved' : 'rejected';
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: request.menteeId.email,
            subject: `Mentorship Request ${emailStatus}`,
            html: `
                <h2>Mentorship Request ${status}</h2>
                <p>Your mentorship request to ${request.mentorId.fullName} has been ${emailStatus}.</p>
                ${status === 'Approved' ? '<p>You can now connect with your mentor to start your learning journey!</p>' : '<p>Feel free to connect with other mentors on our platform.</p>'}
                <a href="${process.env.FRONTEND_URL}/mentorship">Visit Mentorship Page</a>
            `
        };

        await transporter.sendMail(mailOptions);

        // Real-time notification via Socket.IO
        if (io && status === 'Approved') {
            io.emit(`mentorship-approved-${request.menteeId._id}`, {
                message: `Your mentorship request to ${request.mentorId.fullName} was approved!`,
                request: request
            });
        }

        res.json({ message: `Mentorship request ${status} successfully` });
    } catch (error) {
        console.error('Error in approveRequest:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
// Get all mentor applications (Admin only)
const getAllMentorApplications = async (req, res) => {
    try {
        const applications = await MentorApplication.find()
            .populate('userId', 'fullName email profilePicture createdAt')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Error in getAllMentorApplications:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all mentee applications (Admin only)
const getAllMenteeApplications = async (req, res) => {
    try {
        const applications = await MenteeApplication.find()
            .populate('userId', 'fullName email profilePicture createdAt')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Error in getAllMenteeApplications:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Export all functions
module.exports = {
    listMentors,
    requestMentorship,
    getRequests,
    approveRequest,
    applyMentor,
    approveMentor,
    applyMentee,
    approveMentee,
    getMentorApplicationStatus,
    getMenteeApplicationStatus,
    getAllMentorApplications,  // Add this
    getAllMenteeApplications,
    setSocketIO
};