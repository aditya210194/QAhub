'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = dynamic(() => import('../../src/components/AdminDashboard'), {
    ssr: false,
    loading: () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading Admin Panel...</span>
            </div>
        </div>
    )
});

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is admin
        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        if (!token) {
            router.push('/login?redirect=/admin');
            return;
        }

        if (user.role !== 'Admin' && user.role !== 'admin') {
            router.push('/');
            return;
        }
    }, [router]);

    return <AdminDashboard />;
}