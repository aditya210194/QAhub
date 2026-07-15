import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';        // ← ADD THIS
import { SpeedInsights } from '@vercel/speed-insights/next'; // ← ADD THIS
import Providers from './providers';
import ClientLayout from './client-layout';
import ErrorBoundary from '../src/components/ErrorBoundary';

export const metadata = {
    title: 'QA Hub - Software Testing Education',
    description: 'Learn software testing with QA Hub.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            {/* ... head content ... */}
        </head>
        <body>
        <ErrorBoundary>
            <Providers>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </Providers>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
        </body>
        </html>
    );
}