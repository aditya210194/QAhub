import React, { useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "@react-pdf-viewer/core/lib/styles/index.css";
import sampleResume1 from "../resumes/sampleResume1.pdf";
import sampleResume2 from "../resumes/sampleResume2.pdf";
import sampleResume3 from "../resumes/sampleResume3.pdf";
import sampleResume4 from "../resumes/sampleResume4.pdf";
import sampleResume5 from "../resumes/sampleResume5.pdf";
import sampleResume6 from "../resumes/sampleResume6.pdf";
import sampleResume7 from "../resumes/sampleResume7.pdf";
import sampleResume8 from "../resumes/sampleResume8.pdf";
import sampleResume9 from "../resumes/sampleResume9.pdf";
import sampleResume10 from "../resumes/sampleResume10.pdf";
import "C:/Users/AdityaPP/software-testing-edu/client/src/pages/Resumes.css"; // Custom CSS

import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const Resumes = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [selectedResume, setSelectedResume] = useState(sampleResume1); // Default to the first sample resume
    const [uploadedResume, setUploadedResume] = useState(null);
    const [error, setError] = useState(""); // Error state for invalid file uploads
    const [isLoading, setIsLoading] = useState(false); // Loading state for PDF


    const handleResumeChange = (resumePath) => {
        setSelectedResume(resumePath);
        setError(""); // Clear any previous error when switching resumes
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Please upload a valid PDF file.");
                setUploadedResume(null); // Reset uploaded resume
                return;
            }

            setIsLoading(true); // Start loading state
            const fileURL = URL.createObjectURL(file);
            setUploadedResume(fileURL);
            setSelectedResume(fileURL);
            setError(""); // Clear any previous error
            setIsLoading(false); // End loading state
        }
    };

    const handleCreateResume = () => {
        navigate("/resume-generator"); // Navigate to the ResumeGenerator page
    };


    return (
        <div className="resumes-page container mt-4">


            <div className="row">
                <div className="col-md-4 col-12 mb-4">
                    <div className="profile-sidebar">
                        <h4>Choose a Resume Profile</h4>
                        <div className="btn-group-vertical w-100 mb-4">
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume1 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume1)}
                            >
                                Software QA Engineer Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume2 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume2)}
                            >
                                Software Test Engineer Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume3 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume3)}
                            >
                                Test Analyst Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume4 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume4)}
                            >
                                QA Tester Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume5 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume5)}
                            >
                                QA Automation Engineer Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume6 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume6)}
                            >
                                Load/Performance Testing Engineer Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume7 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume7)}
                            >
                                Senior QA Engineer Resume
                            </button>

                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume8 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume8)}
                            >
                                QA Lead Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume9 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume9)}
                            >
                                SDET Resume
                            </button>
                            <button
                                className={`btn btn-outline-primary w-100 mb-2 ${selectedResume === sampleResume10 ? "active" : ""}`}
                                onClick={() => handleResumeChange(sampleResume10)}
                            >
                                QA Manager Resume
                            </button>

                            {/* Repeat for all resume options */}
                            {/* More buttons for sampleResume4 to sampleResume10 */}
                        </div>

                        {/* Tips Section */}
                        <h5>Resume Tips</h5>
                        <ul>
                            <li>Use a clean, professional layout.</li>
                            <li>Tailor your resume to the job description.</li>
                            <li>Highlight your skills and achievements.</li>
                            <li>Use bullet points for easy reading.</li>
                            <li>Include relevant keywords for ATS compatibility.</li>
                            <li>Quantify your achievements with metrics (e.g., reduced test execution time by 20%).</li>
                            <li>Ensure proper formatting with clear headings and consistent font style.</li>
                            <li>Showcase your technical proficiency in relevant tools and technologies.</li>
                            <li>Include a concise and impactful summary at the top.</li>
                            <li>Highlight relevant certifications (e.g., ISTQB, Selenium, etc.).</li>
                            <li>Proofread your resume to avoid any spelling or grammar mistakes.</li>
                            <li>Keep your resume to one or two pages maximum.</li>
                            <li>Include relevant project or internship experience, even if you are a recent graduate.
                            </li>
                            <li>List your soft skills (e.g., communication, teamwork, problem-solving) alongside
                                technical skills.
                            </li>
                            <li>Avoid using excessive jargon or acronyms; ensure clarity for the reader.</li>
                            <li>Focus on the impact of your work rather than just listing job duties.</li>
                        </ul>


                        {/* File Upload */}
                        <label className="btn btn-secondary w-100 mb-3">
                            Upload Custom Resume
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                style={{display: "none"}}
                            />
                        </label>
                        {error && <p className="text-danger">{error}</p>} {/* Display error message */}

                        {/* Create Resume Button */}
                        <div>
                            <button className="btn btn-success w-100" onClick={handleCreateResume}>
                                Create Resume
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Resume Preview */}
                <div className="col-md-8 col-12">
                    <div className="resume-preview">
                        <h4 className="mb-3">Resume Preview</h4>
                        <div className="pdf-viewer border p-3">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <Worker workerUrl={`${process.env.PUBLIC_URL}/pdf.worker.min.js`}>
                                    <Viewer fileUrl={selectedResume || uploadedResume}/>
                                </Worker>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resumes;
