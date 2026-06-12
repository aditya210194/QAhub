// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = sessionStorage.getItem("token");
    const location = useLocation();

    // Get user from localStorage or sessionStorage
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
    const userRole = user?.role;

    // Check if authenticated
    if (!isAuthenticated) {
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    // Check if role is required and user has the right role
    // ✅ FIX: Accept both 'Admin' and 'admin'
    if (requiredRole && userRole !== requiredRole && userRole !== "Admin" && userRole !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;