import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./AdminApp";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const isAdminPath = window.location.pathname.startsWith('/admin');

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <BrowserRouter>
                    {isAdminPath ? (
                        <Routes>
                            <Route path="/admin/*" element={<AdminApp />} />
                        </Routes>
                    ) : (
                        <App />
                    )}
                </BrowserRouter>
            </AuthProvider>
        </HelmetProvider>
    </React.StrictMode>
);