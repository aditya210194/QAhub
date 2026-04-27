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
        // Redirect to login, but pass the current location as 'next'
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    // Check if role is required and user has the right role
    if (requiredRole && userRole !== requiredRole && userRole !== "Admin") {
        // Redirect to home page if user doesn't have required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;