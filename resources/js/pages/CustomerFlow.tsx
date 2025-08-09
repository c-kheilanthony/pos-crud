import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CartPanel } from '../components/customer/CartPanel';
import { LoginForm } from '../components/customer/CustomerLoginForm';
import { Item, ItemsGrid } from '../components/customer/ItemsGrid';
import api from '../lib/customerApi';
import '../lib/echo';

type RestockNotification = {
    id: string; // unique, could be event uuid or timestamp+item
    item_name: string;
    restocked_at: string; // ISO string
};

export default function CustomerFlow() {
    const [token, setToken] = useState(localStorage.getItem('customerToken'));
    const [items, setItems] = useState<Item[]>([]);
    const [cart, setCart] = useState<Record<number, number>>({});
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [restockNotifications, setRestockNotifications] = useState<RestockNotification[]>([]);
    const [notifPanelOpen, setNotifPanelOpen] = useState(false);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const notifRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);

    const fetchItems = async () => {
        const { data } = await api.get<Item[]>('/items');
        setItems(data);
    };

    useEffect(() => {
        if (!customerId) return;

        const channel = (window as any).Echo.private(`customer.${customerId}`).listen('.item.restocked', (e: any) => {
            console.log('Restocked event for you →', e);
            setRestockNotifications((prev) => [
                {
                    id: `${e.item_id}-${Date.now()}`,
                    item_name: e.item_name,
                    restocked_at: new Date().toISOString(),
                },
                ...prev,
            ]);
            if (!notifPanelOpen) setUnreadNotifCount((c) => c + 1);
        });

        return () => {
            channel.stopListening('.item.restocked');
        };
    }, [customerId]);

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
            const { data } = await api.get('/customer/me'); // returns customer
            setCustomerId(data.id); // <- save id
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

    useEffect(() => {
        if (!notifPanelOpen) return;
        const handler = (e: MouseEvent) => {
            // If click is on panel OR bell, ignore
            if (notifRef.current && notifRef.current.contains(e.target as Node)) {
                return;
            }
            if (bellRef.current && bellRef.current.contains(e.target as Node)) {
                return;
            }
            setNotifPanelOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [notifPanelOpen]);

    useEffect(() => {
        const channel = echo.channel('items').listen('.item.updated', (e: any) => {
            console.log('Item updated event received', e);
            setItems((prevItems) => prevItems.map((item) => (item.id === e.item.id ? { ...item, ...e.item } : item)));
        });
        return () => {
            channel.stopListening('.item.updated');
        };
    }, []);

    if (!token) {
        return <LoginForm onSuccess={setToken} />;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Browse Items</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <button
                            ref={bellRef}
                            className="relative rounded-full p-2 transition hover:bg-accent"
                            onClick={() => {
                                setNotifPanelOpen((v) => !v);
                                setUnreadNotifCount(0);
                            }}
                        >
                            <Bell className="h-6 w-6" />
                            {unreadNotifCount > 0 && (
                                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                            )}
                        </button>
                        {notifPanelOpen && (
                            <div
                                ref={notifRef}
                                className="absolute right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
                                    <span className="font-semibold">Restock Notifications</span>
                                    <button className="text-xs text-blue-600 hover:underline" onClick={() => setRestockNotifications([])}>
                                        Clear all
                                    </button>
                                </div>
                                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {restockNotifications.length === 0 ? (
                                        <li className="px-4 py-4 text-center text-zinc-500">No notifications</li>
                                    ) : (
                                        restockNotifications.map((notif, idx) => (
                                            <li key={notif.id} className="flex items-center justify-between px-4 py-3">
                                                <div>
                                                    <span className="font-medium">{notif.item_name}</span>
                                                    <div className="text-xs text-zinc-400">{new Date(notif.restocked_at).toLocaleString()}</div>
                                                </div>
                                                <button
                                                    className="ml-2 text-xs text-zinc-400 hover:text-red-500"
                                                    onClick={() => setRestockNotifications((prev) => prev.filter((n, i) => i !== idx))}
                                                >
                                                    Clear
                                                </button>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
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
