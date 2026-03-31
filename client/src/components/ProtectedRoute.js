/*import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem("token");

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;*/

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem("token");
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, but pass the current location as 'next'
        return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }
    return children;
};

export default ProtectedRoute;