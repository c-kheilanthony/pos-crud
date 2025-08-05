import { Check, Trash2 } from 'lucide-react';
import type { OrderWithItems } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Props {
    orders: OrderWithItems[];
    onView: (order: OrderWithItems) => void;
    onConfirm: (id: number) => void;
    onReject: (id: number) => void;
}

export function OrdersList({ orders, onView, onConfirm, onReject }: Props) {
    if (orders.length === 0) {
        return <p className="text-gray-500">No pending orders</p>;
    }

    return (
        <div className="space-y-4">
            {orders.map((o) => {
                const total = o.items.reduce((sum, item) => sum + item.price * item.pivot.quantity, 0);

                return (
                    <Card
                        key={o.id}
                        className="grid cursor-pointer grid-cols-[1fr_auto] gap-4 p-4 shadow-sm transition-all hover:bg-primary/10 hover:shadow-lg"
                        onClick={() => onView(o)}
                    >
                        {/* Order Details */}
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">Order #{o.id}</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Customer:</span> {o.customer.name}
                            </p>
                            {o.customer.address && (
                                <p className="max-w-[240px] truncate text-sm text-gray-500" title={o.customer.address}>
                                    <span className="font-medium">Address:</span> {o.customer.address}
                                </p>
                            )}
                            {o.customer.contact && (
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Contact:</span> {o.customer.contact}
                                </p>
                            )}
                            <p className="text-sm font-semibold text-primary">
                                Total: ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center space-y-3" onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="ghost"
                                className="h-16 w-16 text-green-600 transition-all hover:scale-105 hover:bg-green-500 hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                onClick={() => onConfirm(o.id)}
                            >
                                <Check className="h-10 w-10" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-16 w-16 text-red-600 transition-all hover:scale-105 hover:bg-red-500 hover:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() => onReject(o.id)}
                            >
                                <Trash2 className="h-10 w-10" />
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
