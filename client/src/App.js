import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Home from './pages/Home';
import Courses from './pages/Courses';
import Articles from './pages/Articles';
import Resources from './pages/Resources';
import Contact from './pages/ContactUs';
import './App.css';
import AutomationTesting from './pages/AutomationTesting';
import ManualTesting from './pages/ManualTesting';
import Agile from './pages/Agile';
import APITesting from './pages/APITesting';
import AutomationGuide from "./pages/Automation Tools and Frameworks Guide";
import InterviewQA from './pages/InterviewQA';
import Resumes from './pages/Resumes';
import ResumeGenerator from "./pages/ResumeGenerator";
import AboutUs from "./pages/AboutUs";
import SoftwareTesting from './pages/SoftwareTesting';
import SecondHeader from "./pages/SecondHeader";
import CourseDetailPage from './pages/CourseDetailPage';
import CommunityFeatures from './pages/CommunityFeatures';
import DiscussionForums from "./pages/DiscussionForums";
import NotFound from "./pages/NotFound";
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
import QAProfile from './components/Profile/QAProfile';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/resetPassword';
import QaHomepage from "./pages/QaHomepage";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import ProtectedRoute from "./components/ProtectedRoute";
import MentorshipProgram from "./pages/MentorshipPage";
import ConsentBanner from "./components/ConsentBanner";
import ErrorBoundary from './components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactGA from 'react-ga';

// ❌ REMOVE ALL ADMIN IMPORTS - They are now in AdminApp.js
// import AdminLayout from './components/AdminLayout';
// import AdminDashboard from './components/AdminDashboard';
// import UserManagement from './admin/UserManagement';
// import AdminAnalytics from './admin/Analytics';
// import PostManagement from './admin/PostManagement';

// Initialize Google Analytics
ReactGA.initialize('G-SDZDRH5VQ9');

// ErrorBoundary wrapper component for routes
const ErrorBoundaryRoute = ({ element: Element }) => (
    <ErrorBoundary>
        <Element />
    </ErrorBoundary>
);

const App = () => {
    const location = useLocation();
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        ReactGA.pageview(location.pathname + location.search);
    }, [location]);

    const shouldShowSecondHeader = !["/", "/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

    return (
        <>
            <ConsentBanner />
            <Header />
            {shouldShowSecondHeader && <SecondHeader />}

            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/terms-and-conditions" element={<TermsConditions />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<AboutUs />} />

                    {/* Protected Routes - Require Authentication */}
                    <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                    <Route path="/course/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />

                    {/* Topic Pages with Error Boundaries */}
                    <Route path="/software-testing" element={<ErrorBoundaryRoute element={SoftwareTesting} />} />
                    <Route path="/automation-testing" element={<ErrorBoundaryRoute element={AutomationTesting} />} />
                    <Route path="/manual-testing" element={<ErrorBoundaryRoute element={ManualTesting} />} />
                    <Route path="/agile" element={<ErrorBoundaryRoute element={Agile} />} />
                    <Route path="/api-testing" element={<ErrorBoundaryRoute element={APITesting} />} />
                    <Route path="/automation-guide" element={<ErrorBoundaryRoute element={AutomationGuide} />} />

                    <Route path="/interview-qa" element={<InterviewQA />} />
                    <Route path="/resumes" element={<Resumes />} />
                    <Route path="/resume-generator" element={<ResumeGenerator />} />

                    {/* Community Features - Require Authentication */}
                    <Route path="/community-features" element={<ProtectedRoute><CommunityFeatures /></ProtectedRoute>} />
                    <Route path="/community-features/discussion-forums" element={<ProtectedRoute><DiscussionForums /></ProtectedRoute>} />
                    <Route path="/community-features/qa" element={<ProtectedRoute><QaHomepage /></ProtectedRoute>} />
                    <Route path="/community-features/qa/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
                    <Route path="/community-features/qa/mentorship-program" element={<ProtectedRoute><MentorshipProgram /></ProtectedRoute>} />

                    {/* Auth Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile setToken={setToken} /></ProtectedRoute>} />
                    <Route path="/community-features/qa/profile/:username" element={<ProtectedRoute><QAProfile /></ProtectedRoute>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/ask" element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} />

                    {/* 404 Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            <Footer />
            <Analytics />
            <SpeedInsights />
        </>
    );
};

export default App;