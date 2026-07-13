'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
    FaTachometerAlt,
    FaUsers,
    FaChartLine,
    FaFileAlt,
    FaSignOutAlt,
    FaShieldAlt
} from 'react-icons/fa';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
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

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
        { path: '/admin/analytics', label: 'Analytics', icon: <FaChartLine /> },
        { path: '/admin/posts', label: 'Posts', icon: <FaFileAlt /> },
    ];

    return (
        <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="admin-sidebar bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
                <div className="admin-brand mb-4">
                    <FaShieldAlt className="me-2" />
                    <span>Admin Panel</span>
                </div>
                <nav className="nav flex-column">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-link text-white ${pathname === item.path ? 'active bg-primary' : ''}`}
                            style={{ borderRadius: '8px', marginBottom: '4px' }}
                        >
                            {item.icon}
                            <span className="ms-2">{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="nav-link text-white mt-3"
                        style={{ borderRadius: '8px', border: 'none', background: 'transparent' }}
                    >
                        <FaSignOutAlt />
                        <span className="ms-2">Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="admin-content flex-grow-1 p-4" style={{ background: '#f0f2f5' }}>
                {children}
            </div>
        </div>
    );
}