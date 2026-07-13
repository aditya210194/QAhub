'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ProtectedRoute = ({ children, requiredRole }) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        if (!token) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
            router.push('/');
            return;
        }
    }, [router, pathname, requiredRole]);

    return children;
};

export default ProtectedRoute;