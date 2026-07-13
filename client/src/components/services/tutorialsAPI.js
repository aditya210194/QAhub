import axios from 'axios';

// ✅ CHANGE: Use NEXT_PUBLIC_API_BASE_URL for Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || process.env.REACT_APP_API_TIMEOUT || 30000);
const API_MODE = process.env.NEXT_PUBLIC_API_MODE || process.env.REACT_APP_API_MODE || 'local';
const LOCAL_DATA_PATH = process.env.NEXT_PUBLIC_LOCAL_DATA_PATH || process.env.REACT_APP_LOCAL_DATA_PATH || '/data/';
const TUTORIALS_ENDPOINT = process.env.NEXT_PUBLIC_TUTORIALS_ENDPOINT || process.env.REACT_APP_TUTORIALS_ENDPOINT || '/tutorials';

// ✅ FIX: Use NEXT_PUBLIC_API_BASE_URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') || sessionStorage.getItem('token') || '' : ''}`
    }
});

// Response interceptor for rate limiting
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] || 60;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(apiClient.request(error.config));
                }, retryAfter * 1000);
            });
        }
        return Promise.reject(error);
    }
);

// ✅ FIX: Check if window is defined (for SSR)
const hasWindow = typeof window !== 'undefined';

export const fetchTutorials = async (fileName = 'software-testing.json') => {
    // Check for mock error (only in browser)
    if (hasWindow && new URLSearchParams(window.location.search).has('mockError')) {
        throw new Error('Simulated API failure');
    }

    // Local mode (read from /public/data/)
    if (API_MODE === 'local') {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const filePath = `${LOCAL_DATA_PATH}${fileName}`;
        console.log('📡 Fetching local file:', filePath);

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        const data = await response.json();
        console.log('✅ Using local mock data');
        return data;
    }

    // Production mode (API call)
    try {
        const response = await apiClient.get(TUTORIALS_ENDPOINT);
        console.log('✅ Using live API data');
        return response.data;
    } catch (error) {
        console.error('⚠️ API failed, falling back to local data:', error.message);
        const fallbackFile = `${LOCAL_DATA_PATH}${fileName}`;
        const localResponse = await fetch(fallbackFile);
        return localResponse.json();
    }
};

export const trackTutorialProgress = async (tutorialId, progress) => {
    try {
        await apiClient.post('/progress', {
            tutorialId,
            progress,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Progress tracking failed:', error);
        // Optional: Implement retry logic here
    }
};