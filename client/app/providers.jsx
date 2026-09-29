'use client';
import { AuthProvider } from '../src/context/AuthContext';

// NOTE: do NOT gate children behind a "mounted" check here.
// That renders only a spinner on the server, so crawlers (including AdSense)
// receive an empty page for every route.
export default function Providers({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
