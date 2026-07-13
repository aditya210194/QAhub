'use client';
import { useState, useEffect } from 'react';
import * as serviceWorker from '../utils/serviceWorker';

export default function UpdateNotification() {
    const [showUpdate, setShowUpdate] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // Check for updates every 5 minutes
        const interval = setInterval(() => {
            if (navigator.onLine) {
                serviceWorker.checkForUpdates();
            }
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const handleUpdate = () => {
        setUpdating(true);
        window.location.reload();
    };

    if (!showUpdate) return null;

    return (
        <div className="update-notification">
            <div className="update-content">
                <span>🔄 New version available!</span>
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                >
                    {updating ? 'Updating...' : 'Update Now'}
                </button>
                <button
                    className="close-btn"
                    onClick={() => setShowUpdate(false)}
                >
                    ×
                </button>
            </div>
        </div>
    );
}