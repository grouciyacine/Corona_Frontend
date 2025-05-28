import axios from 'axios';

export const djangoAPI = axios.create({
    baseURL: 'http://localhost:8000/api', // Django development server
    // baseURL: 'https://your-production-domain.com/api', // For production
    withCredentials: false 
});

djangoAPI.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
djangoAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);