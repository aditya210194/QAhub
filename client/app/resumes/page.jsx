'use client';
import dynamic from 'next/dynamic';

const Resumes = dynamic(() => import('../../src/views/Resumes'), {
    ssr: false,
    loading: () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            color: '#667eea'
        }}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
});

export default function ResumesPage() {
    return <Resumes />;
}