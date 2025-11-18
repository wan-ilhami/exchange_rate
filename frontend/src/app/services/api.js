import axios from 'axios';

// Core Axios Instance (Named Export: api)
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.params);
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('[API] Response error:', error.response?.data || error.message);
        
        if (error.response) {
            const message = error.response.data?.error || error.response.statusText;
            throw new Error(message);
        } else if (error.request) {
            throw new Error('No response from server. Please check your connection.');
        } else {
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
);

// Export only the core instance
export { api };