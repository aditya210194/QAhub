import React, { useState } from 'react';
import { Viewer } from '@react-pdf-viewer/core'; // Import Viewer
import { Worker } from '@react-pdf-viewer/core'; // Import Worker from the viewer
import '@react-pdf-viewer/core/lib/styles/index.css'; // Import viewer styles
import sampleResume1 from './resumes/sampleResume1.pdf';
import sampleResume2 from './resumes/sampleResume2.pdf';
import './Resumes.css'; // Custom CSS
import SecondHeader from './SecondHeader'; // Your Second Header component

// Import the worker from pdfjs-dist and serve it locally
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`; // Set the worker to load from local server

const Resumes = () => {
    const [selectedResume, setSelectedResume] = useState(sampleResume1); // Default to the first sample resume

    const handleResumeChange = (resumePath) => {
        setSelectedResume(resumePath);
    };

    return (
        <div className="container">
            {/* Include the second header here */}
            <SecondHeader />
            <h1>Sample Resumes</h1>
            <div className="row">
                <div className="col-md-4">
                    <h4>Select a Resume</h4>
                    <ul className="resume-list">
                        <li onClick={() => handleResumeChange(sampleResume1)}>Software Engineer Resume</li>
                        <li onClick={() => handleResumeChange(sampleResume2)}>QA Engineer Resume</li>
                        {/* Add more resume links here */}
                    </ul>
                </div>
                <div className="col-md-8">
                    <h4>Resume Preview</h4>
                    <div className="pdf-viewer">
                        {/* Worker component provides a web worker for the viewer */}
                        <Worker workerUrl={`/pdf.worker.min.js`}>
                            <Viewer fileUrl={selectedResume} />
                        </Worker>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resumes;
