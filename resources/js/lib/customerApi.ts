import axios from 'axios';

const customerApi = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

customerApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('customerToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default customerApi;
