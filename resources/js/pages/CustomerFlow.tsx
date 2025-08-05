import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CartPanel } from '../components/customer/CartPanel';
import { LoginForm } from '../components/customer/CustomerLoginForm';
import { Item, ItemsGrid } from '../components/customer/ItemsGrid';
import api from '../lib/customerApi';

export default function CustomerFlow() {
    localStorage.removeItem('cashierToken');

    const [token, setToken] = useState(localStorage.getItem('customerToken'));
    const [items, setItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<Record<number, number>>({});

    const fetchItems = async () => {
        const { data } = await api.get<Item[]>('/items');
        setItems(data);
    };

    const changeQty = (id: number, delta: number) =>
        setCart((c) => {
            const next = (c[id] || 0) + delta;
            return { ...c, [id]: Math.max(0, next) };
        });

    const checkout = async () => {
        const { data: order } = await api.post('/orders', {
            customer_id: 1,
            checkout_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        });
        await Promise.all(
            Object.entries(cart)
                .filter(([, q]) => q > 0)
                .map(([item_id, qty]) => api.post('/order-items', { order_id: order.id, item_id: Number(item_id), quantity: qty })),
        );
        toast.success('Checkout complete!', {
            description: 'Your order has been placed successfully.',
            duration: 3000,
        });
        setCart({});
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        setToken(null);
    };

    const validateToken = async () => {
        try {
            await api.get('/customer/me');
        } catch {
            logout();
        }
    };

    useEffect(() => {
        if (token) {
            validateToken();
            fetchItems();
        }
    }, [token]);

    if (!token) {
        return <LoginForm onSuccess={setToken} />;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Browse Items</h2>
                <div className="space-x-2">
                    <Button variant="outline" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="flex space-x-6">
                <div className="w-2/3">
                    <ItemsGrid items={items} cart={cart} onChangeQty={changeQty} />
                </div>

                <div className="w-1/3">
                    <CartPanel items={items} cart={cart} onCheckout={checkout} showDetails />
                </div>
            </div>
        </div>
    );
}
