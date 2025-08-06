import axios from 'axios';

// Base Axios instance for all customer‑side API calls
const customerApi = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach bearer token (stored by the customer login flow)
customerApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('customerToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/** Get an array of item IDs the logged‑in customer is subscribed to */
export async function fetchSubscriptions(): Promise<number[]> {
    const { data } = await customerApi.get('/subscriptions');
    return data.subscriptions as number[];
}

/** Subscribe the current customer to an out‑of‑stock item */
export async function subscribeToItem(itemId: number): Promise<void> {
    await customerApi.post(`/items/${itemId}/subscribe`);
}

/** Unsubscribe the current customer from an item */
export async function unsubscribeFromItem(itemId: number): Promise<void> {
    await customerApi.delete(`/items/${itemId}/subscribe`);
}

export default customerApi;
