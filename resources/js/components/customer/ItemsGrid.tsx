import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchSubscriptions, subscribeToItem, unsubscribeFromItem } from '../../lib/customerApi';
import { Button } from '../ui/button';

export interface Item {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface ItemsGridProps {
    items: Item[];
    cart: Record<number, number>;
    onChangeQty: (id: number, delta: number) => void;
}

export function ItemsGrid({ items, cart, onChangeQty }: ItemsGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLast = currentPage * itemsPerPage;
    const currentItems = items.slice(indexOfLast - itemsPerPage, indexOfLast);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const [subscribed, setSubscribed] = useState<number[]>([]);

    useEffect(() => {
        fetchSubscriptions().then(setSubscribed).catch(console.error);
    }, []);

    async function toggleSubscription(itemId: number) {
        try {
            if (subscribed.includes(itemId)) {
                await unsubscribeFromItem(itemId);
                setSubscribed((s) => s.filter((id) => id !== itemId));
            } else {
                await subscribeToItem(itemId);
                setSubscribed((s) => [...s, itemId]);
            }
            console.log('Now subscribed:', subscribed);
        } catch (err) {
            console.error('Subscription error', err);
        }
    }

    const isSubscribed = (id: number) => subscribed.includes(id);

    return (
        <div className="flex h-full flex-col">
            <div className="overflow-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2 text-left">Item</th>
                            <th className="border p-2 text-right">Price</th>
                            <th className="border p-2 text-center">Stock</th>
                            <th className="border p-2 text-center">Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id}>
                                {/* Item name -- clickable toggle */}
                                <td className="border p-2">
                                    <button
                                        className={`flex max-w-[100px] items-center space-x-1 truncate ${
                                            isSubscribed(item.id) ? 'text-indigo-600' : ''
                                        }`}
                                        title={isSubscribed(item.id) ? 'Click to unsubscribe' : 'Click to be notified on restock'}
                                        onClick={() => toggleSubscription(item.id)}
                                    >
                                        {isSubscribed(item.id) && (
                                            <Star className="h-4 w-4 shrink-0 text-yellow-500" fill="currentColor" stroke="currentColor" />
                                        )}
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                </td>

                                {/* price */}
                                <td className="border p-2 text-right">₱{item.price > 9999 ? '9,999' : item.price}</td>

                                {/* stock */}
                                <td className="border p-2 text-center">{item.stock > 99 ? '+99' : Math.max(0, item.stock)}</td>

                                {/* qty controls (unchanged) */}
                                <td className="border p-2 text-center">
                                    <Button size="icon" onClick={() => onChangeQty(item.id, -1)} disabled={!cart[item.id] || cart[item.id] <= 0}>
                                        –
                                    </Button>

                                    <input
                                        type="number"
                                        value={Math.min(cart[item.id] || 0, 99)}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value, 10);
                                            if (isNaN(val)) val = 0;
                                            val = Math.max(0, Math.min(item.stock, val));
                                            onChangeQty(item.id, val - (cart[item.id] || 0));
                                        }}
                                        className="w-12 [appearance:textfield] rounded border text-center focus:ring-1 focus:ring-blue-400 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        min={0}
                                        max={Math.min(item.stock, 99)}
                                    />

                                    <Button
                                        size="icon"
                                        onClick={() => onChangeQty(item.id, +1)}
                                        disabled={item.stock === 0 || (cart[item.id] || 0) >= item.stock}
                                    >
                                        +
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {/* filler rows */}
                        {Array.from({ length: itemsPerPage - currentItems.length }).map((_, i) => (
                            <tr key={`empty-${i}`} className="h-12">
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                                <td className="border p-2">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* pagination footer */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button key={page} size="sm" variant={page === currentPage ? 'default' : 'ghost'} onClick={() => setCurrentPage(page)}>
                            {page}
                        </Button>
                    ))}

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
