import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ConsentBanner from "./components/ConsentBanner";
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactGA from 'react-ga';

// 🔥 Lazy load EVERYTHING
const Home = lazy(() => import('./pages/Home'));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Courses = lazy(() => import('./pages/Courses'));
const Articles = lazy(() => import('./pages/Articles'));
const Resources = lazy(() => import('./pages/Resources'));
const Contact = lazy(() => import('./pages/ContactUs'));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));

const AutomationTesting = lazy(() => import('./pages/AutomationTesting'));
const ManualTesting = lazy(() => import('./pages/ManualTesting'));
const Agile = lazy(() => import('./pages/Agile'));
const APITesting = lazy(() => import('./pages/APITesting'));
const AutomationGuide = lazy(() => import("./pages/Automation Tools and Frameworks Guide"));

const InterviewQA = lazy(() => import('./pages/InterviewQA'));
const Resumes = lazy(() => import('./pages/Resumes'));
const ResumeGenerator = lazy(() => import("./pages/ResumeGenerator"));

const SoftwareTesting = lazy(() => import('./pages/SoftwareTesting'));

const CommunityFeatures = lazy(() => import('./pages/CommunityFeatures'));
const DiscussionForums = lazy(() => import("./pages/DiscussionForums"));
const QaHomepage = lazy(() => import("./pages/QaHomepage"));
const QuestionDetail = lazy(() => import("./pages/QuestionDetail"));
const AskQuestion = lazy(() => import("./pages/AskQuestion"));
const MentorshipProgram = lazy(() => import("./pages/MentorshipPage"));

const Register = lazy(() => import('./components/Auth/Register'));
const Login = lazy(() => import('./components/Auth/Login'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const QAProfile = lazy(() => import('./components/Profile/QAProfile'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/resetPassword'));

const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));
const SecondHeader = lazy(() => import("./pages/SecondHeader"));

// Initialize GA
ReactGA.initialize('G-SDZDRH5VQ9');

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

            <Suspense fallback={<div style={{ padding: "40px" }}>Loading...</div>}>
                {shouldShowSecondHeader && <SecondHeader />}

                <main>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/terms-and-conditions" element={<TermsConditions />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/articles" element={<Articles />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<AboutUs />} />

                        {/* Protected */}
                        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                        <Route path="/course/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />

                        {/* Topics */}
                        <Route path="/software-testing" element={<ErrorBoundaryRoute element={SoftwareTesting} />} />
                        <Route path="/automation-testing" element={<ErrorBoundaryRoute element={AutomationTesting} />} />
                        <Route path="/manual-testing" element={<ErrorBoundaryRoute element={ManualTesting} />} />
                        <Route path="/agile" element={<ErrorBoundaryRoute element={Agile} />} />
                        <Route path="/api-testing" element={<ErrorBoundaryRoute element={APITesting} />} />
                        <Route path="/automation-guide" element={<ErrorBoundaryRoute element={AutomationGuide} />} />

                        {/* Others */}
                        <Route path="/interview-qa" element={<InterviewQA />} />
                        <Route path="/resumes" element={<Resumes />} />
                        <Route path="/resume-generator" element={<ResumeGenerator />} />

                        {/* Community */}
                        <Route path="/community-features" element={<ProtectedRoute><CommunityFeatures /></ProtectedRoute>} />
                        <Route path="/community-features/discussion-forums" element={<ProtectedRoute><DiscussionForums /></ProtectedRoute>} />
                        <Route path="/community-features/qa" element={<ProtectedRoute><QaHomepage /></ProtectedRoute>} />
                        <Route path="/community-features/qa/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
                        <Route path="/community-features/qa/mentorship-program" element={<ProtectedRoute><MentorshipProgram /></ProtectedRoute>} />

                        {/* Auth */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<ProtectedRoute><Profile setToken={setToken} /></ProtectedRoute>} />
                        <Route path="/community-features/qa/profile/:username" element={<ProtectedRoute><QAProfile /></ProtectedRoute>} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/ask" element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </Suspense>

            <Footer />
            <Analytics />
            <SpeedInsights />
        </>
    );
};

export default App;