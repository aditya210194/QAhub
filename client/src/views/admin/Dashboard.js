import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaUserGraduate, FaClock } from 'react-icons/fa';
import './AdminPages.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        mentorApplications: 0,
        menteeApplications: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [mentorsRes, menteesRes, usersRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/mentorship/admin/mentor-applications`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/mentorship/admin/mentee-applications`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/users/admin/users`, { headers })
            ]);

            setStats({
                totalUsers: usersRes.data.users?.length || 0,
                mentorApplications: mentorsRes.data.length,
                menteeApplications: menteesRes.data.length,
                pendingApprovals: mentorsRes.data.filter(a => a.status === 'Pending').length +
                                 menteesRes.data.filter(a => a.status === 'Pending').length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: <FaUsers />, color: '#3b82f6' },
        { title: 'Mentor Apps', value: stats.mentorApplications, icon: <FaChalkboardTeacher />, color: '#8b5cf6' },
        { title: 'Mentee Apps', value: stats.menteeApplications, icon: <FaUserGraduate />, color: '#ec4899' },
        { title: 'Pending Approvals', value: stats.pendingApprovals, icon: <FaClock />, color: '#f59e0b' }
    ];

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;

    return (
        <div className="admin-page">
            <h1>Dashboard</h1>
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                        <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;