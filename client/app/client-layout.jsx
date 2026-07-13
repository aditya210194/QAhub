'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CookieConsentProvider, CookieService, ConsentMode } from '@vantezzen/react-cookie-banner';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import SecondHeader from '../src/views/SecondHeader';
import ConsentBanner from '../src/components/ConsentBanner';
import ScrollToTop from '../src/components/ScrollToTop';

// ✅ Conditionally import Vercel Analytics only in production
let Analytics, SpeedInsights;
if (process.env.NODE_ENV === 'production') {
    try {
        const vercelAnalytics = require('@vercel/analytics/react');
        const vercelSpeedInsights = require('@vercel/speed-insights/react');
        Analytics = vercelAnalytics.Analytics;
        SpeedInsights = vercelSpeedInsights.SpeedInsights;
    } catch (e) {
        console.log('⚠️ Vercel Analytics not available');
    }
}

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const shouldShowSecondHeader = ![
        "/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password"
    ].includes(pathname);

    return (
        <CookieConsentProvider>
            <ConsentMode />
            <ScrollToTop />

            <CookieService
                id="google-analytics"
                category="analytics"
                name="Google Analytics"
                consentMode
            >
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-SDZDRH5VQ9"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-SDZDRH5VQ9');
                        `,
                    }}
                />
            </CookieService>

            <CookieService
                id="google-adsense"
                category="marketing"
                name="Google AdSense"
                consentMode
            >
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5486373988162570"
                    crossOrigin="anonymous"
                />
            </CookieService>

            <ConsentBanner />
            <Header />
            {shouldShowSecondHeader && <SecondHeader />}

            <main>
                {children}
            </main>

            <Footer />

            {/* ✅ Only render Vercel Analytics in production */}
            {process.env.NODE_ENV === 'production' && mounted && Analytics && (
                <Analytics />
            )}
            {process.env.NODE_ENV === 'production' && mounted && SpeedInsights && (
                <SpeedInsights />
            )}
        </CookieConsentProvider>
    );
}