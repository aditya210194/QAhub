import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CookieConsentProvider, CookieService, ConsentMode } from '@vantezzen/react-cookie-banner';
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
// ✅ ADD THIS IMPORT - TutorialPage (replaces all individual tutorial pages)
import TutorialPage from './pages/TutorialPage';
// ❌ REMOVE or comment out these individual imports
// import AutomationTesting from './pages/AutomationTesting';
// import ManualTesting from './pages/ManualTesting';
// import Agile from './pages/Agile';
// import APITesting from './pages/APITesting';
// import AutomationGuide from "./pages/Automation Tools and Frameworks Guide";
import InterviewQA from './pages/InterviewQA';
import Resumes from './pages/Resumes';
import ResumeGenerator from "./pages/ResumeGenerator";
import AboutUs from "./pages/AboutUs";
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
import ScrollToTop from './components/ScrollToTop';

// ErrorBoundary wrapper component for routes
const ErrorBoundaryRoute = ({ element: Element }) => (
    <ErrorBoundary>
        <Element />
    </ErrorBoundary>
);

const App = () => {
    const location = useLocation();
    const [token, setToken] = useState(sessionStorage.getItem('token'));

    const shouldShowSecondHeader = !["/", "/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

    return (
        <CookieConsentProvider>
            <ConsentMode />
            <ScrollToTop />

            <CookieService
                id="google-analytics"
                category="analytics"
                name="Google Analytics"
                consentMode
            >
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-SDZDRH5VQ9"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-SDZDRH5VQ9');
                        `,
                    }}
                />
            </CookieService>

            <CookieService
                id="google-adsense"
                category="marketing"
                name="Google AdSense"
                consentMode
            >
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5486373988162570"
                    crossOrigin="anonymous"
                />
            </CookieService>

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

                    {/* Tutorial Routes - with keys to force re-render */}
                    <Route path="/software-testing" element={<TutorialPage key="software-testing" />} />
                    <Route path="/automation-testing" element={<TutorialPage key="automation-testing" />} />
                    <Route path="/manual-testing" element={<TutorialPage key="manual-testing" />} />
                    <Route path="/agile" element={<TutorialPage key="agile" />} />
                    <Route path="/api-testing" element={<TutorialPage key="api-testing" />} />
                    <Route path="/automation-guide" element={<TutorialPage key="automation-tools" />} />
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
        </CookieConsentProvider>
    );
};

export default App;