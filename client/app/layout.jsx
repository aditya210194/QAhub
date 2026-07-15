import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from './providers';
import ClientLayout from './client-layout';
import ErrorBoundary from '../src/components/ErrorBoundary';

export const metadata = {
    title: 'QA Hub - Software Testing Education',
    description: 'Learn software testing with QA Hub.',
    // ✅ Remove this if you don't have the code yet
    // verification: {
    //     google: 'your-adsense-verification-code',
    // },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            {/* ✅ Google AdSense Code Snippet (Fixed) */}
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5486373988162570"
                crossOrigin="anonymous"
            />

            {/* ✅ AdSense Meta Tag */}
            <meta name="google-adsense-account" content="ca-pub-5486373988162570" />
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