// src/components/ConsentBanner.jsx
import { useCookieConsent } from '@vantezzen/react-cookie-banner';

const ConsentBanner = () => {
  const { acceptAllCookies, declineAllCookies, visible } = useCookieConsent();

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
      padding: '1rem',
      zIndex: 1000,
      textAlign: 'center',
      borderTop: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif'
    }}>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
        We use cookies to enhance your experience, analyze site traffic, and serve personalized ads.
        By clicking "Accept All", you consent to our use of cookies.
        <a href="/privacy-policy" style={{ marginLeft: '5px', color: '#667eea' }}>Learn more</a>
      </p>
      <div>
        <button
          onClick={declineAllCookies}
          style={{
            marginRight: '10px',
            padding: '8px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Decline
        </button>
        <button
          onClick={acceptAllCookies}
          style={{
            padding: '8px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;