import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = sessionStorage.getItem("token");
    const location = useLocation();

    let user = {};

    try {
        const storedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");

        user = storedUser && storedUser !== "undefined"
            ? JSON.parse(storedUser)
            : {};
    } catch (error) {
        console.error("Invalid user JSON:", error);

        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        user = {};
    }

    const userRole = user?.role;

    // Check if authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to={`/login?next=${encodeURIComponent(
                    location.pathname + location.search
                )}`}
                replace
            />
        );
    }

    // Role check
    if (
        requiredRole &&
        userRole !== requiredRole &&
        userRole !== "Admin"
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;