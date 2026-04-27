import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./AdminApp"; // ✅ Import AdminApp
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Check if current path is admin route
const isAdminPath = window.location.pathname.startsWith('/admin');

root.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                {isAdminPath ? (
                    // For admin routes - only AdminApp
                    <Routes>
                        <Route path="/admin/*" element={<AdminApp />} />
                    </Routes>
                ) : (
                    // For main website - only App
                    <App />
                )}
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);