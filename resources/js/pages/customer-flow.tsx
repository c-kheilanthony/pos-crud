import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../lib/api';

export default function CustomerFlow() {
    const [email, setEmail] = useState('ash@example.com');
    const [password, setPassword] = useState('pikachu');
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [items, setItems] = useState<any[]>([]);
    const [cart, setCart] = useState<Record<number, number>>({});

    const login = async () => {
        const { data } = await api.post('/customer/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
    };

    const fetchItems = async () => {
        const { data } = await api.get('/items');
        setItems(data);
    };

    const changeQty = (id: number, delta: number) => {
        setCart((c) => {
            const q = (c[id] || 0) + delta;
            return { ...c, [id]: Math.max(0, q) };
        });
    };

    const checkout = async () => {
        const { data: order } = await api.post('/orders', {
            customer_id: 1, // TODO: Replace with actual logged-in user ID
            checkout_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        });

        await Promise.all(
            Object.entries(cart)
                .filter(([, qty]) => qty > 0)
                .map(([item_id, quantity]) =>
                    api.post('/order-items', {
                        order_id: order.id,
                        item_id: Number(item_id),
                        quantity,
                    }),
                ),
        );

        alert('✅ Checkout complete!');
        setCart({});
    };

    if (!token) {
        return (
            <div className="mx-auto mt-16 max-w-md">
                <Card className="space-y-4 p-6">
                    <h2 className="text-2xl font-bold">Customer Login</h2>
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
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Browse Items</h2>
                <Button onClick={fetchItems}>Refresh</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <Card key={item.id} className="space-y-2 p-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p>Price: ₱{item.price}</p>
                        <p>Stock: {item.stock}</p>
                        <div className="flex items-center space-x-2">
                            <Button onClick={() => changeQty(item.id, -1)} disabled={!cart[item.id]}>
                                –
                            </Button>
                            <span className="w-6 text-center">{cart[item.id] || 0}</span>
                            <Button onClick={() => changeQty(item.id, +1)} disabled={cart[item.id] >= item.stock}>
                                +
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-4">
                <h3 className="mb-2 text-xl font-semibold">Your Cart</h3>
                {Object.entries(cart)
                    .filter(([, qty]) => qty > 0)
                    .map(([id, qty]) => {
                        const item = items.find((i) => i.id === Number(id));
                        return (
                            <div key={id} className="flex justify-between py-1">
                                <span>{item?.name}</span>
                                <span>
                                    {qty} × ₱{item?.price}
                                </span>
                            </div>
                        );
                    })}
                <Button className="mt-4 w-full" onClick={checkout} disabled={!Object.values(cart).some((q) => q)}>
                    Checkout
                </Button>
            </Card>
        </div>
    );
}
