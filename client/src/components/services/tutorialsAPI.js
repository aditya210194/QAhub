import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
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

export const fetchTutorials = async (fileName = 'software-testing.json') => {
    if (new URLSearchParams(window.location.search).has('mockError')) {
        throw new Error('Simulated API failure');
    }

    // Local mode (read from /public/data/)
    if (process.env.REACT_APP_API_MODE === 'local') {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        const filePath = `${process.env.REACT_APP_LOCAL_DATA_PATH}${fileName}`;
        console.log('Fetching local file:', filePath);

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        const data = await response.json();
        console.log('Using local mock data', data);
        return data;
    }

    // Production mode (API call)
    try {
        const response = await apiClient.get(process.env.REACT_APP_TUTORIALS_ENDPOINT);
        console.log('Using live API data', response.data);
        return response.data;
    } catch (error) {
        console.error('API failed, falling back to local data');
        const fallbackFile = `${process.env.REACT_APP_LOCAL_DATA_PATH}${fileName}`;
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
        console.error('Progress tracking failed:', error);
        // Optional: Implement retry logic here
    }
};