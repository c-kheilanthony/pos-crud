import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';

export default function CashierFlow() {
    const [email, setEmail] = useState('brock@example.com');
    const [password, setPassword] = useState('onix');
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [orders, setOrders] = useState<any[]>([]);

    const login = async () => {
        const { data } = await api.post('/cashier/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
    };

    const fetchOrders = async () => {
        // TODO: Replace with API for pending orders if available
        const { data } = await api.get('/orders'); // Adjust endpoint if needed
        setOrders(data);
    };

    const confirmOrder = async (id: number) => {
        await api.put(`/orders/${id}`, { cashier_id: 1 }); // Adjust payload if API requires more fields
        fetchOrders();
    };

    if (!token) {
        return (
            <div className="mx-auto mt-16 max-w-md">
                <Card className="space-y-4 p-6">
                    <h2 className="text-2xl font-bold">Cashier Login</h2>
                    <div>
                        <Label>Email</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button className="w-full" onClick={login}>
                        Login
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Pending Orders</h2>
                <Button onClick={fetchOrders}>Refresh</Button>
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p>No pending orders</p>
                ) : (
                    orders.map((o) => (
                        <Card key={o.id} className="flex items-center justify-between p-4">
                            <div>
                                <h3 className="text-lg font-semibold">Order #{o.id}</h3>
                                <p>Customer ID: {o.customer_id}</p>
                            </div>
                            <Button onClick={() => confirmOrder(o.id)}>Confirm</Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
