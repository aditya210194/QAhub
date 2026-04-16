// AdminDashboard.js - Complete Admin Panel with Logout Button
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEye,
    FaEnvelope,
    FaPhone,
    FaLinkedin,
    FaStar,
    FaChartLine,
    FaCalendarAlt,
    FaSearch,
    FaFilter,
    FaDownload,
    FaExclamationTriangle,
    FaSpinner,
    FaCheck,
    FaBan,
    FaComments,
    FaUserTie,
    FaGraduationCap,
    FaCode,
    FaBullseye,
    FaRocket,
    FaArrowLeft,
    FaSyncAlt,
    FaThumbsUp,
    FaThumbsDown,
    FaInfoCircle,
    FaRegFileAlt,
    FaTachometerAlt,
    FaUserCheck,
    FaUserPlus,
    FaUserTimes,
    FaChartPie,
    FaChartBar,
    FaCalendarWeek,
    FaHourglassHalf,
    FaAward,
    FaRobot,
    FaCog,
    FaBell,
    FaTrashAlt,
    FaEdit,
    FaBan as FaSuspend,
    FaShieldAlt,
    FaDatabase,
    FaServer,
    FaCloudUploadAlt,
    FaSignOutAlt,

} from 'react-icons/fa';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './AdminDashboard.css';
import Analytics from '../admin/Analytics';

const AdminDashboard = () => {
    // State Management
    const [activeSection, setActiveSection] = useState('overview');
    const [mentorApplications, setMentorApplications] = useState([]);
    const [menteeApplications, setMenteeApplications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [analyticsData, setAnalyticsData] = useState({
        applicationsTrend: [],
        monthlyGrowth: [],
        skillDistribution: [],
        experienceLevels: []
    });
    const [recentActivities, setRecentActivities] = useState([]);

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Colors for charts
    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

    // Close mobile menu when clicking a link (for better UX)
    const handleNavClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    // ✅ Logout function
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout from Admin Panel?')) {
            // Clear all stored data
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // Show notification
            showNotification('Logged out successfully', 'success');

            // Redirect to login page
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const [mentorsRes, menteesRes, usersRes, analyticsRes, activitiesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/admin/mentor-applications`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/admin/mentee-applications`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/admin/analytics`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/admin/recent-activities`, { headers })
            ]);

            setMentorApplications(Array.isArray(mentorsRes.data) ? mentorsRes.data : []);
            setMenteeApplications(Array.isArray(menteesRes.data) ? menteesRes.data : []);

            const usersData = usersRes.data.users || usersRes.data;
            setAllUsers(Array.isArray(usersData) ? usersData : []);

            setAnalyticsData(analyticsRes.data || {});
            setRecentActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);

            showNotification('Data refreshed successfully', 'success');
        } catch (error) {
            console.error('Error fetching data:', error);
            showNotification('Failed to fetch data', 'error');
            setMentorApplications([]);
            setMenteeApplications([]);
            setAllUsers([]);
            setRecentActivities([]);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 60000);
        return () => clearInterval(interval);
    }, [fetchAllData]);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const handleApplicationAction = async (applicationId, type, action) => {
        setConfirmAction({ applicationId, type, action });
        setShowConfirmModal(true);
    };

    const confirmActionHandler = async () => {
        const { applicationId, type, action } = confirmAction;
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');

            // ✅ Fix: Use correct endpoints based on your backend
            let endpoint;
            if (type === 'mentor') {
                endpoint = action === 'approve'
                    ? `/api/mentorship/approve-mentor/${applicationId}`
                    : `/api/mentorship/reject-mentor/${applicationId}`;
            } else {
                endpoint = action === 'approve'
                    ? `/api/mentorship/approve-mentee/${applicationId}`
                    : `/api/mentorship/reject-mentee/${applicationId}`;
            }

            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}${endpoint}`,
                { status: action === 'approve' ? 'Approved' : 'Rejected' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            showNotification(`Application ${action}d successfully`, 'success');
            fetchAllData();
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error updating application:', error);
            showNotification(error.response?.data?.message || 'Failed to update application', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserAction = async (userId, action) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showNotification(`User ${action}d successfully`, 'success');
            fetchAllData();
        } catch (error) {
            console.error('Error managing user:', error);
            showNotification('Failed to manage user', 'error');
        }
    };

    const exportToCSV = (data, filename) => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const getStats = useCallback(() => {
        const mentorStats = {
            pending: mentorApplications.filter(a => a.status === 'Pending').length,
            approved: mentorApplications.filter(a => a.status === 'Approved').length,
            rejected: mentorApplications.filter(a => a.status === 'Rejected').length,
            total: mentorApplications.length
        };

        const menteeStats = {
            pending: menteeApplications.filter(a => a.status === 'Pending').length,
            approved: menteeApplications.filter(a => a.status === 'Approved').length,
            rejected: menteeApplications.filter(a => a.status === 'Rejected').length,
            total: menteeApplications.length
        };

        const userStats = {
            total: allUsers.length,
            mentors: allUsers.filter(u => u.role === 'Mentor').length,
            mentees: allUsers.filter(u => u.role === 'Mentee').length,
            admins: allUsers.filter(u => u.role === 'Admin').length,
            active: allUsers.filter(u => u.isActive !== false).length,
            inactive: allUsers.filter(u => u.isActive === false).length
        };

        return { mentorStats, menteeStats, userStats };
    }, [mentorApplications, menteeApplications, allUsers]);

    const stats = getStats();

    const getFilteredApplications = (applications) => {
        let filtered = [...applications];
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }
        return filtered;
    };

    // Sidebar Navigation Component with Logout
    const Sidebar = () => (
        <div className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <FaShieldAlt className="sidebar-icon" />
                <h2>Admin Panel</h2>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                    onClick={() => handleNavClick('overview')}
                >
                    <FaTachometerAlt /> Overview
                </button>
                <button
                    className={`nav-item ${activeSection === 'mentors' ? 'active' : ''}`}
                    onClick={() => handleNavClick('mentors')}
                >
                    <FaChalkboardTeacher /> Mentor Applications
                    {stats.mentorStats.pending > 0 && <span className="badge">{stats.mentorStats.pending}</span>}
                </button>
                <button
                    className={`nav-item ${activeSection === 'mentees' ? 'active' : ''}`}
                    onClick={() => handleNavClick('mentees')}
                >
                    <FaUserGraduate /> Mentee Applications
                    {stats.menteeStats.pending > 0 && <span className="badge">{stats.menteeStats.pending}</span>}
                </button>
                <button
                    className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                    onClick={() => handleNavClick('users')}
                >
                    <FaUsers /> Users Management
                </button>
                <button
                    className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
                    onClick={() => handleNavClick('analytics')}
                >
                    <FaChartLine /> Analytics
                </button>
                <button
                    className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                    onClick={() => handleNavClick('settings')}
                >
                    <FaCog /> Settings
                </button>

                {/* ✅ Logout Button */}
                <button
                    className="nav-item logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt /> Logout
                </button>
            </nav>
        </div>
    );

    // Overview Dashboard Component
    const Overview = () => (
        <div className="overview-section">
            <div className="stats-grid">
                <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
                    <div className="stat-icon mentor-icon">
                        <FaChalkboardTeacher />
                    </div>
                    <div className="stat-info">
                        <h3>Mentor Applications</h3>
                        <div className="stat-numbers">
                            <span className="total">{stats.mentorStats.total}</span>
                            <div className="stat-breakdown">
                                <span className="approved"><FaCheckCircle /> {stats.mentorStats.approved}</span>
                                <span className="pending"><FaClock /> {stats.mentorStats.pending}</span>
                                <span className="rejected"><FaTimesCircle /> {stats.mentorStats.rejected}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
                    <div className="stat-icon mentee-icon">
                        <FaUserGraduate />
                    </div>
                    <div className="stat-info">
                        <h3>Mentee Applications</h3>
                        <div className="stat-numbers">
                            <span className="total">{stats.menteeStats.total}</span>
                            <div className="stat-breakdown">
                                <span className="approved"><FaCheckCircle /> {stats.menteeStats.approved}</span>
                                <span className="pending"><FaClock /> {stats.menteeStats.pending}</span>
                                <span className="rejected"><FaTimesCircle /> {stats.menteeStats.rejected}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
                    <div className="stat-icon users-icon">
                        <FaUsers />
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <div className="stat-numbers">
                            <span className="total">{stats.userStats.total}</span>
                            <div className="stat-breakdown">
                                <span><FaChalkboardTeacher /> {stats.userStats.mentors}</span>
                                <span><FaUserGraduate /> {stats.userStats.mentees}</span>
                                <span><FaShieldAlt /> {stats.userStats.admins}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ scale: 1.02 }}>
                    <div className="stat-icon active-icon">
                        <FaUserCheck />
                    </div>
                    <div className="stat-info">
                        <h3>Active Users</h3>
                        <div className="stat-numbers">
                            <span className="total">{stats.userStats.active}</span>
                            <div className="stat-breakdown">
                                <span className="active"><FaUserCheck /> Active</span>
                                <span className="inactive"><FaUserTimes /> Inactive</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Applications Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.applicationsTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="mentors" stroke="#8b5cf6" name="Mentors" />
                            <Line type="monotone" dataKey="mentees" stroke="#ec4899" name="Mentees" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Approved', value: stats.mentorStats.approved + stats.menteeStats.approved },
                                    { name: 'Pending', value: stats.mentorStats.pending + stats.menteeStats.pending },
                                    { name: 'Rejected', value: stats.mentorStats.rejected + stats.menteeStats.rejected }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="recent-activities">
                <h3><FaBell /> Recent Activities</h3>
                <div className="activities-list">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="activity-item">
                            <div className="activity-icon">
                                {activity.type === 'approve' && <FaCheckCircle className="approve" />}
                                {activity.type === 'reject' && <FaTimesCircle className="reject" />}
                                {activity.type === 'register' && <FaUserPlus className="register" />}
                            </div>
                            <div className="activity-details">
                                <p>{activity.message}</p>
                                <small>{new Date(activity.timestamp).toLocaleString()}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button onClick={() => exportToCSV(mentorApplications, 'mentor-applications')}>
                        <FaDownload /> Export Mentor Data
                    </button>
                    <button onClick={() => exportToCSV(menteeApplications, 'mentee-applications')}>
                        <FaDownload /> Export Mentee Data
                    </button>
                    <button onClick={() => exportToCSV(allUsers, 'users')}>
                        <FaDownload /> Export Users Data
                    </button>
                    <button onClick={fetchAllData}>
                        <FaSyncAlt /> Refresh All Data
                    </button>
                </div>
            </div>
        </div>
    );

    // Mentor Applications Section - Enhanced with more data
    const MentorApplications = () => {
        const filteredApps = getFilteredApplications(mentorApplications);
        return (
            <div className="applications-section">
                <div className="section-header">
                    <h2><FaChalkboardTeacher /> Mentor Applications</h2>
                    <div className="filters">
                        <div className="search-box">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button onClick={() => exportToCSV(filteredApps, 'mentor-applications')}>
                            <FaDownload /> Export
                        </button>
                    </div>
                </div>
                <div className="applications-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Expertise</th>
                                <th>Experience</th>
                                <th>Availability</th>
                                <th>LinkedIn</th>
                                <th>Applied On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.map((app) => (
                                <tr key={app._id}>
                                    <td>{app.user?.fullName || 'N/A'}</td>
                                    <td>{app.user?.email || 'N/A'}</td>
                                    <td>{app.expertise || 'Not specified'}</td>
                                    <td>{app.experience || 'N/A'} years</td>
                                    <td>{app.availability || 'Not specified'}</td>
                                    <td>
                                        {app.linkedIn ? (
                                            <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}>
                                                Profile
                                            </a>
                                        ) : 'N/A'}
                                    </td>
                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${app.status?.toLowerCase()}`}>
                                            {app.status === 'Pending' && <FaClock />}
                                            {app.status === 'Approved' && <FaCheckCircle />}
                                            {app.status === 'Rejected' && <FaTimesCircle />}
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="view-btn" onClick={() => { setSelectedApplication(app); setShowDetailsModal(true); }}>
                                            <FaEye /> View
                                        </button>
                                        {app.status === 'Pending' && (
                                            <>
                                                <button className="approve-btn" onClick={() => handleApplicationAction(app._id, 'mentor', 'approve')}>
                                                    <FaCheck /> Approve
                                                </button>
                                                <button className="reject-btn" onClick={() => handleApplicationAction(app._id, 'mentor', 'reject')}>
                                                    <FaBan /> Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

   // Mentee Applications Section - Enhanced with more data
   const MenteeApplications = () => {
       const filteredApps = getFilteredApplications(menteeApplications);
       return (
           <div className="applications-section">
               <div className="section-header">
                   <h2><FaUserGraduate /> Mentee Applications</h2>
                   <div className="filters">
                       <div className="search-box">
                           <FaSearch />
                           <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                       </div>
                       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                           <option value="all">All Status</option>
                           <option value="Pending">Pending</option>
                           <option value="Approved">Approved</option>
                           <option value="Rejected">Rejected</option>
                       </select>
                       <button onClick={() => exportToCSV(filteredApps, 'mentee-applications')}><FaDownload /> Export</button>
                   </div>
               </div>
               <div className="applications-table">
                   <table>
                       <thead>
                           <tr>
                               <th>Name</th>
                               <th>Email</th>
                               <th>Learning Goals</th>
                               <th>Current Skills</th>
                               <th>Desired Skills</th>
                               <th>Time Commitment</th>
                               <th>Applied On</th>
                               <th>Status</th>
                               <th>Actions</th>
                           </tr>
                       </thead>
                       <tbody>
                           {filteredApps.map((app) => (
                               <tr key={app._id}>
                                   <td>{app.user?.fullName || 'N/A'}</td>
                                   <td>{app.user?.email || 'N/A'}</td>
                                   <td style={{ maxWidth: '200px' }}>{app.learningGoals?.substring(0, 60)}...</td>
                                   <td>{app.currentSkills || 'Not specified'}</td>
                                   <td>{app.desiredSkills || 'Not specified'}</td>
                                   <td>{app.timeCommitment || 'N/A'} hrs/week</td>
                                   <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                   <td>
                                       <span className={`status-badge ${app.status?.toLowerCase()}`}>
                                           {app.status === 'Pending' && <FaClock />}
                                           {app.status === 'Approved' && <FaCheckCircle />}
                                           {app.status === 'Rejected' && <FaTimesCircle />}
                                           {app.status}
                                       </span>
                                   </td>
                                   <td className="actions">
                                       <button className="view-btn" onClick={() => { setSelectedApplication(app); setShowDetailsModal(true); }}>
                                           <FaEye /> View
                                       </button>
                                       {app.status === 'Pending' && (
                                           <>
                                               <button className="approve-btn" onClick={() => handleApplicationAction(app._id, 'mentee', 'approve')}>
                                                   <FaCheck /> Approve
                                               </button>
                                               <button className="reject-btn" onClick={() => handleApplicationAction(app._id, 'mentee', 'reject')}>
                                                   <FaBan /> Reject
                                               </button>
                                           </>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       );
   };

    // Users Management Section
    const UsersManagement = () => {
        const filteredUsers = allUsers.filter(user =>
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
            <div className="users-section">
                <div className="section-header">
                    <h2><FaUsers /> User Management</h2>
                    <div className="filters">
                        <div className="search-box"><FaSearch /><input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                        <button onClick={() => exportToCSV(filteredUsers, 'users')}><FaDownload /> Export</button>
                    </div>
                </div>
                <div className="users-table">
                    <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td><span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span></td>
                                    <td><span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>{user.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button className="view-btn" onClick={() => { setSelectedApplication(user); setShowDetailsModal(true); }}><FaEye /> View</button>
                                        {user.role !== 'Admin' && (<><button className="edit-btn" onClick={() => handleUserAction(user._id, 'edit-role')}><FaEdit /> Edit Role</button>{user.isActive !== false ? (<button className="suspend-btn" onClick={() => handleUserAction(user._id, 'suspend')}><FaSuspend /> Suspend</button>) : (<button className="activate-btn" onClick={() => handleUserAction(user._id, 'activate')}><FaUserCheck /> Activate</button>)}</>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };



    // Settings Section
    const Settings = () => (
        <div className="settings-section">
            <h2><FaCog /> System Settings</h2>
            <div className="settings-grid">
                <div className="settings-card"><h3>Email Notifications</h3><label className="setting-item"><input type="checkbox" defaultChecked /> Send email on new applications</label><label className="setting-item"><input type="checkbox" defaultChecked /> Notify admin on user registration</label><label className="setting-item"><input type="checkbox" defaultChecked /> Send weekly reports</label></div>
                <div className="settings-card"><h3>Application Settings</h3><label className="setting-item">Auto-approve mentor applications: <input type="checkbox" /></label><label className="setting-item">Max mentee applications: <input type="number" defaultValue="1" min="1" max="5" /></label><label className="setting-item">Max mentor applications: <input type="number" defaultValue="1" min="1" max="5" /></label></div>
                <div className="settings-card"><h3>Security Settings</h3><label className="setting-item">Require email verification: <input type="checkbox" defaultChecked /></label><label className="setting-item">Two-factor authentication: <input type="checkbox" defaultChecked /></label><label className="setting-item">Session timeout: <input type="number" defaultValue="60" min="15" max="480" /> minutes</label></div>
            </div>
        </div>
    );

    // Details Modal - Enhanced with safe data handling
    const DetailsModal = () => (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>
                        {selectedApplication?.expertise ? 'Mentor Application Details' :
                         selectedApplication?.learningGoals ? 'Mentee Application Details' :
                         'User Details'}
                    </h3>
                    <button className="close-modal" onClick={() => setShowDetailsModal(false)}>×</button>
                </div>
                <div className="modal-body">
                    {selectedApplication && (
                        <div className="details-grid">
                            {/* Personal Information Section */}
                            <div className="detail-section full-width">
                                <h4 className="section-title">📋 Personal Information</h4>
                            </div>
                            <div className="detail-item">
                                <label>Full Name:</label>
                                <p>{selectedApplication.user?.fullName || selectedApplication.fullName || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <label>Username:</label>
                                <p>{selectedApplication.user?.username || selectedApplication.username || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <label>Email:</label>
                                <p><a href={`mailto:${selectedApplication.user?.email || selectedApplication.email}`}>
                                    {selectedApplication.user?.email || selectedApplication.email || 'N/A'}
                                </a></p>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge ${(selectedApplication.status || 'pending').toLowerCase()}`}>
                                    {selectedApplication.status || 'Pending'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Applied On:</label>
                                <p>{selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <label>Last Updated:</label>
                                <p>{selectedApplication.updatedAt ? new Date(selectedApplication.updatedAt).toLocaleString() : 'N/A'}</p>
                            </div>

                            {/* Mentor Specific Fields */}
                            {selectedApplication.expertise && (
                                <>
                                    <div className="detail-section full-width">
                                        <h4 className="section-title">💼 Professional Information</h4>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Expertise / Skills:</label>
                                        <div className="skills-container">
                                            {selectedApplication.expertise ? (
                                                typeof selectedApplication.expertise === 'string'
                                                    ? selectedApplication.expertise.split(',').map((skill, i) => (
                                                        <span key={i} className="skill-tag">{skill.trim()}</span>
                                                    ))
                                                    : Array.isArray(selectedApplication.expertise)
                                                        ? selectedApplication.expertise.map((skill, i) => (
                                                            <span key={i} className="skill-tag">{skill}</span>
                                                        ))
                                                        : <span className="skill-tag">{selectedApplication.expertise}</span>
                                            ) : 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label>Experience:</label>
                                        <p>{selectedApplication.experience || 'N/A'} years</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Availability:</label>
                                        <p>{selectedApplication.availability || 'Not specified'}</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Hourly Rate:</label>
                                        <p>${selectedApplication.hourlyRate || 'Negotiable'}/hr</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>LinkedIn Profile:</label>
                                        <p>
                                            {selectedApplication.linkedIn ? (
                                                <a href={selectedApplication.linkedIn} target="_blank" rel="noopener noreferrer">
                                                    <FaLinkedin /> View Profile
                                                </a>
                                            ) : 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Bio / About:</label>
                                        <p className="bio-text">{selectedApplication.bio || 'No bio provided'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Certifications:</label>
                                        <div className="skills-container">
                                            {selectedApplication.certifications ? (
                                                Array.isArray(selectedApplication.certifications) && selectedApplication.certifications.length > 0 ? (
                                                    selectedApplication.certifications.map((cert, i) => (
                                                        <span key={i} className="cert-tag">📜 {cert}</span>
                                                    ))
                                                ) : typeof selectedApplication.certifications === 'string' ? (
                                                    <span className="cert-tag">📜 {selectedApplication.certifications}</span>
                                                ) : (
                                                    'No certifications listed'
                                                )
                                            ) : 'No certifications listed'}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Mentee Specific Fields */}
                            {selectedApplication.learningGoals && (
                                <>
                                    <div className="detail-section full-width">
                                        <h4 className="section-title">🎓 Learning Information</h4>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Learning Goals:</label>
                                        <p className="bio-text">{selectedApplication.learningGoals || 'Not specified'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Current Skills:</label>
                                        <div className="skills-container">
                                            {selectedApplication.currentSkills ? (
                                                typeof selectedApplication.currentSkills === 'string'
                                                    ? selectedApplication.currentSkills.split(',').map((skill, i) => (
                                                        <span key={i} className="skill-tag">{skill.trim()}</span>
                                                    ))
                                                    : Array.isArray(selectedApplication.currentSkills)
                                                        ? selectedApplication.currentSkills.map((skill, i) => (
                                                            <span key={i} className="skill-tag">{skill}</span>
                                                        ))
                                                        : <span className="skill-tag">{selectedApplication.currentSkills}</span>
                                            ) : 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Desired Skills to Learn:</label>
                                        <div className="skills-container">
                                            {selectedApplication.desiredSkills ? (
                                                typeof selectedApplication.desiredSkills === 'string'
                                                    ? selectedApplication.desiredSkills.split(',').map((skill, i) => (
                                                        <span key={i} className="skill-tag desired">{skill.trim()}</span>
                                                    ))
                                                    : Array.isArray(selectedApplication.desiredSkills)
                                                        ? selectedApplication.desiredSkills.map((skill, i) => (
                                                            <span key={i} className="skill-tag desired">{skill}</span>
                                                        ))
                                                        : <span className="skill-tag desired">{selectedApplication.desiredSkills}</span>
                                            ) : 'Not specified'}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label>Time Commitment:</label>
                                        <p>{selectedApplication.timeCommitment || 'Not specified'} hours/week</p>
                                    </div>
                                    <div className="detail-item">
                                        <label>Preferred Language:</label>
                                        <p>{selectedApplication.preferredLanguage || 'Not specified'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Background / Experience:</label>
                                        <p className="bio-text">{selectedApplication.background || 'No background provided'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Expectations from Mentorship:</label>
                                        <p className="bio-text">{selectedApplication.expectations || 'Not specified'}</p>
                                    </div>
                                </>
                            )}

                            {/* User Management Fields */}
                            {!selectedApplication.expertise && !selectedApplication.learningGoals && selectedApplication.role && (
                                <>
                                    <div className="detail-section full-width">
                                        <h4 className="section-title">👤 User Information</h4>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Role:</label>
                                        <p>{selectedApplication.role || 'User'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Bio:</label>
                                        <p className="bio-text">{selectedApplication.bio || 'No bio'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Skills:</label>
                                        <div className="skills-container">
                                            {selectedApplication.skills && Array.isArray(selectedApplication.skills) && selectedApplication.skills.length > 0 ? (
                                                selectedApplication.skills.map((skill, i) => (
                                                    <span key={i} className="skill-tag">{skill}</span>
                                                ))
                                            ) : selectedApplication.skills && typeof selectedApplication.skills === 'string' ? (
                                                <span className="skill-tag">{selectedApplication.skills}</span>
                                            ) : 'No skills listed'}
                                        </div>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Location:</label>
                                        <p>{selectedApplication.location || 'Not specified'}</p>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Experience Level:</label>
                                        <p>{selectedApplication.experienceLevel || 'Not specified'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
                    {selectedApplication?.status === 'Pending' && (
                        <>
                            <button
                                className="btn-approve"
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    const type = selectedApplication.expertise ? 'mentor' : (selectedApplication.learningGoals ? 'mentee' : 'user');
                                    if (type !== 'user') {
                                        handleApplicationAction(selectedApplication._id, type, 'approve');
                                    }
                                }}
                            >
                                <FaCheck /> Approve
                            </button>
                            <button
                                className="btn-reject"
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    const type = selectedApplication.expertise ? 'mentor' : (selectedApplication.learningGoals ? 'mentee' : 'user');
                                    if (type !== 'user') {
                                        handleApplicationAction(selectedApplication._id, type, 'reject');
                                    }
                                }}
                            >
                                <FaBan /> Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    // Confirm Modal
    const ConfirmModal = () => (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header"><h3>Confirm Action</h3><button className="close-modal" onClick={() => setShowConfirmModal(false)}>×</button></div>
                <div className="modal-body"><FaExclamationTriangle className="warning-icon" /><p>Are you sure you want to {confirmAction?.action} this application?</p><p>This action cannot be undone.</p></div>
                <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button><button className={`btn-${confirmAction?.action}`} onClick={confirmActionHandler} disabled={isLoading}>{isLoading ? <FaSpinner className="spinning" /> : 'Confirm'}</button></div>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            {/* Mobile Menu Toggle Button */}
            <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
            >
                {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar with mobile menu state */}
            <Sidebar />

            <div className="admin-main">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <div className="header-actions">
                        <button onClick={fetchAllData} className="refresh-btn">
                            <FaSyncAlt className={isLoading ? 'spinning' : ''} />
                            Refresh
                        </button>
                        <div className="admin-profile">
                            <FaShieldAlt />
                            <span>Admin</span>
                        </div>
                    </div>
                </div>

                <div className="admin-content">
                    {activeSection === 'overview' && <Overview />}
                    {activeSection === 'mentors' && <MentorApplications />}
                    {activeSection === 'mentees' && <MenteeApplications />}
                    {activeSection === 'users' && <UsersManagement />}
                    {activeSection === 'analytics' && <Analytics />}
                    {activeSection === 'settings' && <Settings />}
                </div>
            </div>

            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' && <FaCheckCircle />}
                    {notification.type === 'error' && <FaExclamationTriangle />}
                    {notification.message}
                </div>
            )}

            {showDetailsModal && <DetailsModal />}
            {showConfirmModal && <ConfirmModal />}
        </div>
    );
};

export default AdminDashboard;