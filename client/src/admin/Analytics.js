// client/src/admin/Analytics.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ComposedChart
} from 'recharts';
import {
    FaUsers, FaChartLine, FaCalendarAlt, FaDownload, FaSyncAlt,
    FaUserPlus, FaUserCheck, FaUserGraduate, FaChalkboardTeacher,
    FaEye, FaThumbsUp, FaComments, FaShare, FaArrowUp, FaArrowDown,
    FaSpinner, FaFileExport, FaPrint, FaFilter,FaClock,FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './Analytics.css';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalUsers: 0,
            activeUsers: 0,
            totalMentors: 0,
            totalMentees: 0,
            totalApplications: 0,
            pendingApplications: 0,
            approvedApplications: 0,
            rejectedApplications: 0
        },
        mentorApplications: [],
        menteeApplications: [],
        users: [],
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [activeChart, setActiveChart] = useState('overview');

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

    // Fetch real data from your API
    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            // Fetch all data in parallel
            const [mentorsRes, menteesRes, usersRes, activitiesRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/mentor-applications`, { headers }),
                axios.get(`${API_URL}/api/admin/mentee-applications`, { headers }),
                axios.get(`${API_URL}/api/admin/users`, { headers }),
                axios.get(`${API_URL}/api/admin/recent-activities`, { headers })
            ]);

            const mentorApps = Array.isArray(mentorsRes.data) ? mentorsRes.data : [];
            const menteeApps = Array.isArray(menteesRes.data) ? menteesRes.data : [];
            const usersData = usersRes.data.users || (Array.isArray(usersRes.data) ? usersRes.data : []);
            const activities = Array.isArray(activitiesRes.data) ? activitiesRes.data : [];

            // Calculate statistics from real data
            const totalMentors = usersData.filter(u => u.role === 'Mentor').length;
            const totalMentees = usersData.filter(u => u.role === 'Mentee').length;
            const totalUsers = usersData.length;
            const activeUsers = usersData.filter(u => u.isActive !== false).length;

            const pendingMentors = mentorApps.filter(a => a.status === 'Pending').length;
            const approvedMentors = mentorApps.filter(a => a.status === 'Approved').length;
            const rejectedMentors = mentorApps.filter(a => a.status === 'Rejected').length;

            const pendingMentees = menteeApps.filter(a => a.status === 'Pending').length;
            const approvedMentees = menteeApps.filter(a => a.status === 'Approved').length;
            const rejectedMentees = menteeApps.filter(a => a.status === 'Rejected').length;

            // Process trends data (group by month)
            const trendsMap = new Map();

            // Add mentor applications to trends
            mentorApps.forEach(app => {
                const date = new Date(app.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                if (!trendsMap.has(month)) {
                    trendsMap.set(month, { month, mentors: 0, mentees: 0, users: 0 });
                }
                trendsMap.get(month).mentors++;
            });

            // Add mentee applications to trends
            menteeApps.forEach(app => {
                const date = new Date(app.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                if (!trendsMap.has(month)) {
                    trendsMap.set(month, { month, mentors: 0, mentees: 0, users: 0 });
                }
                trendsMap.get(month).mentees++;
            });

            // Add new users to trends
            usersData.forEach(user => {
                const date = new Date(user.createdAt);
                const month = date.toLocaleString('default', { month: 'short' });
                if (!trendsMap.has(month)) {
                    trendsMap.set(month, { month, mentors: 0, mentees: 0, users: 0 });
                }
                trendsMap.get(month).users++;
            });

            const trends = Array.from(trendsMap.values()).sort((a, b) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.indexOf(a.month) - months.indexOf(b.month);
            });

            // Skills distribution from mentor applications
            const skillsMap = new Map();
            mentorApps.forEach(app => {
                if (app.expertise) {
                    const skills = app.expertise.split(',').map(s => s.trim());
                    skills.forEach(skill => {
                        skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
                    });
                }
            });

            const skillDistribution = Array.from(skillsMap.entries())
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Experience levels distribution
            const experienceMap = new Map();
            mentorApps.forEach(app => {
                const level = app.experience || 'Beginner';
                experienceMap.set(level, (experienceMap.get(level) || 0) + 1);
            });

            const experienceLevels = Array.from(experienceMap.entries()).map(([level, mentors]) => ({
                level,
                mentors,
                mentees: Math.floor(Math.random() * 20) // Placeholder for mentee experience
            }));

            setAnalyticsData({
                overview: {
                    totalUsers,
                    activeUsers,
                    totalMentors,
                    totalMentees,
                    totalApplications: mentorApps.length + menteeApps.length,
                    pendingApplications: pendingMentors + pendingMentees,
                    approvedApplications: approvedMentors + approvedMentees,
                    rejectedApplications: rejectedMentors + rejectedMentees,
                    mentorStats: {
                        total: mentorApps.length,
                        pending: pendingMentors,
                        approved: approvedMentors,
                        rejected: rejectedMentors
                    },
                    menteeStats: {
                        total: menteeApps.length,
                        pending: pendingMentees,
                        approved: approvedMentees,
                        rejected: rejectedMentees
                    }
                },
                mentorApplications: mentorApps,
                menteeApplications: menteeApps,
                users: usersData,
                recentActivities: activities,
                trends,
                skillDistribution,
                experienceLevels
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Export to Excel
    const exportToExcel = (data, filename) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
        XLSX.writeFile(wb, `${filename}.xlsx`);
    };

    // Export to PDF (print)
    const exportToPDF = () => {
        window.print();
    };

    // KPI Card Component
    const KPICard = ({ title, value, change, icon, color }) => (
        <div className="analytics-kpi-card" style={{ borderTopColor: color }}>
            <div className="kpi-icon" style={{ background: `${color}15`, color }}>
                {icon}
            </div>
            <div className="kpi-info">
                <h4>{title}</h4>
                <div className="kpi-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                {change !== undefined && (
                    <div className={`kpi-change ${change >= 0 ? 'positive' : 'negative'}`}>
                        {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(change)}% from last period
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="analytics-loading">
                <FaSpinner className="spinning" />
                <p>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div className="advanced-analytics">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1><FaChartLine /> Advanced Analytics Dashboard</h1>
                    <p>Real-time insights from your platform data</p>
                </div>
                <div className="analytics-actions">
                    <button onClick={fetchAnalytics} className="refresh-btn">
                        <FaSyncAlt /> Refresh
                    </button>
                    <button onClick={() => exportToExcel(analyticsData.mentorApplications, 'mentor-applications')} className="export-btn">
                        <FaFileExport /> Export Mentors
                    </button>
                    <button onClick={() => exportToExcel(analyticsData.menteeApplications, 'mentee-applications')} className="export-btn">
                        <FaFileExport /> Export Mentees
                    </button>
                    <button onClick={exportToPDF} className="print-btn">
                        <FaPrint /> Print
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="analytics-tabs">
                <button className={activeChart === 'overview' ? 'active' : ''} onClick={() => setActiveChart('overview')}>
                    Overview
                </button>
                <button className={activeChart === 'mentors' ? 'active' : ''} onClick={() => setActiveChart('mentors')}>
                    Mentor Analytics
                </button>
                <button className={activeChart === 'mentees' ? 'active' : ''} onClick={() => setActiveChart('mentees')}>
                    Mentee Analytics
                </button>
                <button className={activeChart === 'trends' ? 'active' : ''} onClick={() => setActiveChart('trends')}>
                    Trends
                </button>
            </div>

            {/* KPI Section */}
            <div className="kpi-grid">
                <KPICard
                    title="Total Users"
                    value={analyticsData.overview.totalUsers}
                    icon={<FaUsers />}
                    color="#6366f1"
                />
                <KPICard
                    title="Active Users"
                    value={analyticsData.overview.activeUsers}
                    icon={<FaUserCheck />}
                    color="#10b981"
                />
                <KPICard
                    title="Total Mentors"
                    value={analyticsData.overview.totalMentors}
                    icon={<FaChalkboardTeacher />}
                    color="#8b5cf6"
                />
                <KPICard
                    title="Total Mentees"
                    value={analyticsData.overview.totalMentees}
                    icon={<FaUserGraduate />}
                    color="#ec4899"
                />
                <KPICard
                    title="Total Applications"
                    value={analyticsData.overview.totalApplications}
                    icon={<FaUserPlus />}
                    color="#f59e0b"
                />
                <KPICard
                    title="Pending Reviews"
                    value={analyticsData.overview.pendingApplications}
                    icon={<FaClock />}
                    color="#ef4444"
                />
            </div>

            {/* Charts Section */}
            <div className="analytics-charts">
                {activeChart === 'overview' && (
                    <>
                        <div className="chart-card full-width">
                            <h3>Applications Overview</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Approved', value: analyticsData.overview.approvedApplications },
                                            { name: 'Pending', value: analyticsData.overview.pendingApplications },
                                            { name: 'Rejected', value: analyticsData.overview.rejectedApplications }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Cell fill="#10b981" />
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#ef4444" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>User Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Mentors', value: analyticsData.overview.totalMentors },
                                            { name: 'Mentees', value: analyticsData.overview.totalMentees },
                                            { name: 'Users', value: analyticsData.overview.totalUsers - analyticsData.overview.totalMentors - analyticsData.overview.totalMentees }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {activeChart === 'mentors' && (
                    <>
                        <div className="chart-card full-width">
                            <h3>Mentor Applications Status</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                    { status: 'Pending', count: analyticsData.overview.mentorStats?.pending || 0 },
                                    { status: 'Approved', count: analyticsData.overview.mentorStats?.approved || 0 },
                                    { status: 'Rejected', count: analyticsData.overview.mentorStats?.rejected || 0 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" name="Applications" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Top Skills (Mentors)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData.skillDistribution} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="skill" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" name="Mentors" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-card">
                            <h3>Experience Levels</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData.experienceLevels}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="level" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="mentors" fill="#8b5cf6" name="Mentors" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {activeChart === 'mentees' && (
                    <div className="chart-card full-width">
                        <h3>Mentee Applications Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { status: 'Pending', count: analyticsData.overview.menteeStats?.pending || 0 },
                                { status: 'Approved', count: analyticsData.overview.menteeStats?.approved || 0 },
                                { status: 'Rejected', count: analyticsData.overview.menteeStats?.rejected || 0 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="status" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#ec4899" name="Applications" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {activeChart === 'trends' && (
                    <div className="chart-card full-width">
                        <h3>Monthly Growth Trends</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={analyticsData.trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="users" fill="#6366f1" name="New Users" />
                                <Line yAxisId="right" type="monotone" dataKey="mentors" stroke="#8b5cf6" name="Mentor Apps" />
                                <Line yAxisId="right" type="monotone" dataKey="mentees" stroke="#ec4899" name="Mentee Apps" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Recent Activity Section */}
            <div className="analytics-insights">
                <h3><FaClock /> Recent Activities</h3>
                <div className="insights-grid">
                    {analyticsData.recentActivities.slice(0, 4).map((activity, index) => (
                        <div key={index} className="insight-card">
                            <div className="insight-icon">
                                {activity.type === 'approve' && '✅'}
                                {activity.type === 'reject' && '❌'}
                                {activity.type === 'register' && '📝'}
                            </div>
                            <div className="insight-content">
                                <h4>{activity.type?.toUpperCase()}</h4>
                                <p>{activity.message}</p>
                                <small>{new Date(activity.timestamp).toLocaleString()}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;