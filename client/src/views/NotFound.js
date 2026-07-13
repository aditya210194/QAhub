'use client';
import React from 'react';
import Link from 'next/link';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#667eea' }}>404</h1>
            <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
            <p style={{ color: '#666', marginBottom: '32px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/" style={{
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