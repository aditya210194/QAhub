import React, { lazy, Suspense, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { CookieConsentProvider, CookieService, ConsentMode } from '@vantezzen/react-cookie-banner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from "./components/ProtectedRoute";
import ConsentBanner from "./components/ConsentBanner";
import ErrorBoundary from './components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import ScrollToTop from './components/ScrollToTop';
import SecondHeader from "./views/SecondHeader";
import './App.css';

// ===== LAZY LOADED PAGES =====
// Each page is only downloaded when the user navigates to it

// Core pages
const Home = lazy(() => import('./views/Home'));
const AboutUs = lazy(() => import('./views/AboutUs'));
const Contact = lazy(() => import('./views/ContactUs'));
const NotFound = lazy(() => import('./views/NotFound'));

// Legal
const TermsConditions = lazy(() => import('./views/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy'));

// Content pages
const Articles = lazy(() => import('./views/Articles'));
const Resources = lazy(() => import('./views/Resources'));
const InterviewQA = lazy(() => import('./views/InterviewQA'));
const Resumes = lazy(() => import('./views/Resumes'));
const ResumeGenerator = lazy(() => import('./views/ResumeGenerator'));

// Course pages (protected)
const Courses = lazy(() => import('./views/Courses'));
const CourseDetailPage = lazy(() => import('./views/CourseDetailPage'));

// Tutorial pages
const TutorialPage = lazy(() => import('./views/TutorialPage'));

// Community pages (protected)
const CommunityFeatures = lazy(() => import('./views/CommunityFeatures'));
const DiscussionForums = lazy(() => import('./views/DiscussionForums'));
const QaHomepage = lazy(() => import('./views/QaHomepage'));
const QuestionDetail = lazy(() => import('./views/QuestionDetail'));
const AskQuestion = lazy(() => import('./views/AskQuestion'));
const MentorshipProgram = lazy(() => import('./views/MentorshipPage'));

// Auth pages
const Register = lazy(() => import('./components/Auth/Register'));
const Login = lazy(() => import('./components/Auth/Login'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/resetPassword'));

// Profile pages (protected)
const Profile = lazy(() => import('./components/Profile/Profile'));
const QAProfile = lazy(() => import('./components/Profile/QAProfile'));

// ===== LOADING FALLBACK =====
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1rem',
        color: '#667eea'
    }}>
        <div className="spinner-border" role="status" style={{ color: '#667eea' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const App = () => {
    const location = usePathname();
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
                <Suspense fallback={<PageLoader />}>
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

                        {/* Tutorial Routes */}
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
                </Suspense>
            </main>

            <Footer />
            <Analytics />
            <SpeedInsights />
        </CookieConsentProvider>
    );
};

export default App;