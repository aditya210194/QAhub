import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Articles from './pages/Articles';
import Resources from './pages/Resources';
import Contact from './pages/ContactUs';
import './App.css'; //
import AutomationTesting from './pages/AutomationTesting';
import ManualTesting from './pages/ManualTesting';
import Agile from './pages/Agile';
import InterviewQA from './pages/InterviewQA';
import Resumes from './pages/Resumes';
import AboutUs from "./pages/AboutUs";
import SoftwareTesting from './pages/SoftwareTesting';
// Import your CSS file


const App = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<AboutUs />} />
                    {/* Topic Pages */}
                    <Route path="/software-testing" element={<SoftwareTesting />} />
                    <Route path="/automation-testing" element={<AutomationTesting />} />
                    <Route path="/manual-testing" element={<ManualTesting />} />
                    <Route path="/agile" element={<Agile />} />
                    <Route path="/interview-qa" element={<InterviewQA />} />
                    <Route path="/resumes" element={<Resumes />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
