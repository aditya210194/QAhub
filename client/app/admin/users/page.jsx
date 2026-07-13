'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserManagement = dynamic(() => import('../../../src/admin/UserManagement'), {
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
                <span className="visually-hidden">Loading Users...</span>
            </div>
        </div>
    )
});

export default function AdminUsersPage() {
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        if (!token) {
            router.push('/login?redirect=/admin/users');
            return;
        }

        if (user.role !== 'Admin' && user.role !== 'admin') {
            router.push('/');
            return;
        }
    }, [router]);

    return <UserManagement />;
}