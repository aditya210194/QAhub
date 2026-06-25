import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Helmet>
                <title>Page Not Found | QA Hub</title>
                <meta name="description" content="The page you're looking for doesn't exist. Return to QA Hub and continue your software testing learning journey." />
            </Helmet>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#667eea' }}>404</h1>
            <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
            <p style={{ color: '#666', marginBottom: '32px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" style={{
                background: '#667eea',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
            }}>
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;