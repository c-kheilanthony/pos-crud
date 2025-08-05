import { Eye } from 'lucide-react';
import type { OrderWithItems } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export interface Order {
    id: number;
    customer: { name: string };
    cashier_id: number | null;
}

interface Props {
    orders: OrderWithItems[];
    onView: (order: OrderWithItems) => void;
}

export function OrdersList({ orders, onView }: Props) {
    if (orders.length === 0) {
        return <p>No pending orders</p>;
    }

    return (
        <div className="space-y-4">
            {orders.map((o) => (
                <Card key={o.id} className="flex items-center justify-between p-4">
                    <div>
                        <h3 className="text-lg font-semibold">Order #{o.id}</h3>
                        <p>Customer: {o.customer.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onView(o)}>
                        <Eye className="h-5 w-5" />
                    </Button>
                </Card>
            ))}
        </div>
    );
}
