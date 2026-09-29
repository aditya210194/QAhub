import { Suspense } from 'react';
import Login from '../../src/components/Auth/Login';

export const metadata = { title: 'Login | QA Hub', robots: { index: false } };

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <Login />
        </Suspense>
    );
}
