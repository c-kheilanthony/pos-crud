import axios from 'axios';

const cashierApi = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

cashierApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('cashierToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default cashierApi;
