// components/ConsentBanner.js
import React, { useState, useEffect } from 'react';

const ConsentBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const userConsent = localStorage.getItem('userConsent');
        if (!userConsent) {
            setShowBanner(true);
        } else {
            // Re-apply consent on reload
            window.gtag?.('consent', 'update', {
                ad_storage: userConsent === 'granted' ? 'granted' : 'denied',
                analytics_storage: userConsent === 'granted' ? 'granted' : 'denied'
            });
        }
    }, []);

    const handleConsent = (choice) => {
        localStorage.setItem('userConsent', choice ? 'granted' : 'denied');
        window.gtag?.('consent', 'update', {
            ad_storage: choice ? 'granted' : 'denied',
            analytics_storage: choice ? 'granted' : 'denied'
        });
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: '#000',
            color: '#fff',
            padding: '1rem',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
        }}>
            We use cookies to improve your experience. Do you accept?
            <button style={{ padding: '6px 12px' }} onClick={() => handleConsent(true)}>Accept</button>
            <button style={{ padding: '6px 12px' }} onClick={() => handleConsent(false)}>Decline</button>
        </div>
    );
};

export default ConsentBanner;
