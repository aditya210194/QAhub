// client/src/AdminApp.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './admin/UserManagement';
import AdminAnalytics from './admin/Analytics';
import PostManagement from './admin/PostManagement';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";

const AdminApp = () => {
    return (
        <>
            <Routes>
                {/* Dashboard - without AdminLayout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* User Management - without AdminLayout */}
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Analytics - without AdminLayout */}
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminAnalytics />
                        </ProtectedRoute>
                    }
                />

                {/* Post Management - without AdminLayout */}
                <Route
                    path="/posts"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <PostManagement />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Analytics />
            <SpeedInsights />
        </>
    );
};

export default AdminApp;